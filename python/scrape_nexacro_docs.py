"""
nexacroN V24 레퍼런스 가이드(docs.tobesoft.com) 좌측 메뉴 트리를 순회하며
각 챕터 페이지의 본문을 Markdown으로 변환해 로컬에 저장하는 스크립트.

사용법:
    python scrape_nexacro_docs.py            # 전체 342개 페이지 크롤링
    python scrape_nexacro_docs.py --limit 10  # 앞의 10개만 크롤링 (테스트용)
    python scrape_nexacro_docs.py --skip-existing  # 이미 저장된 파일은 건너뛰기 (재개용)
"""

import argparse
import re
import time

from bs4 import BeautifulSoup
from markdownify import markdownify
from playwright.sync_api import sync_playwright

BASE_URL = "https://docs.tobesoft.com/reference_guide_nexacro_n_v24_ko"
OUTPUT_DIR = "output"
REQUEST_DELAY_SEC = 0.4
INVALID_FILENAME_CHARS = r'[\\/:*?"<>|]'


def sanitize_segment(segment):
    segment = segment.strip()
    segment = re.sub(INVALID_FILENAME_CHARS, "", segment)
    return segment


def label_to_filename(label):
    # "5.Application > Tray > TrayPopupMenu" -> "Application_Tray_TrayPopupMenu.md"
    label = re.sub(r"^\d+\.\s*", "", label.strip())
    segments = [sanitize_segment(s) for s in label.split(" > ")]
    return "_".join(segments) + ".md"


def collect_leaf_labels(page):
    return page.evaluate(
        """
        () => {
            const all = Array.from(document.querySelectorAll('ui-tree-item'));
            const leaves = all.filter(el => el.querySelectorAll('ui-tree-item').length === 0);
            return leaves.map(el => el.textContent.trim());
        }
        """
    )


def click_leaf_by_label(page, label):
    handle = page.evaluate_handle(
        """
        (label) => {
            const all = Array.from(document.querySelectorAll('ui-tree-item'));
            return all.find(el =>
                el.querySelectorAll('ui-tree-item').length === 0 &&
                el.textContent.trim() === label
            );
        }
        """,
        label,
    )
    element = handle.as_element()
    if element is None:
        raise RuntimeError(f"트리에서 '{label}' 항목을 찾지 못했습니다")
    element.click()


def wait_for_content_update(page, previous_h1_text, timeout_ms=8000):
    try:
        page.wait_for_function(
            """
            (prevText) => {
                const h1 = document.querySelector('h1');
                return h1 && h1.textContent.trim() !== prevText;
            }
            """,
            arg=previous_h1_text,
            timeout=timeout_ms,
        )
    except Exception:
        pass
    page.wait_for_timeout(300)


def extract_content(page):
    return page.evaluate(
        """
        () => {
            const h1 = document.querySelector('h1');
            const body = document.querySelector('div.chapter_content');
            if (!h1 || !body) return null;
            return { title: h1.textContent.trim(), bodyHtml: body.outerHTML };
        }
        """
    )


def html_to_markdown(title, body_html):
    soup = BeautifulSoup(body_html, "html.parser")
    for icon in soup.find_all("ui-icon"):
        icon.decompose()
    body_markdown = markdownify(str(soup), heading_style="ATX").strip()
    return f"# {title}\n\n{body_markdown}\n"


def scrape(limit=None, skip_existing=False):
    output_path = __file__
    import os

    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 900})
        page.goto(BASE_URL, wait_until="load", timeout=60000)
        page.wait_for_timeout(8000)

        labels = collect_leaf_labels(page)
        if limit:
            labels = labels[:limit]

        print(f"총 {len(labels)}개 페이지 처리 시작")

        success, failed = [], []
        prev_h1 = ""
        for i, label in enumerate(labels, 1):
            filename = label_to_filename(label)
            filepath = os.path.join(output_dir, filename)

            if skip_existing and os.path.exists(filepath):
                print(f"[{i}/{len(labels)}] 건너뜀 (이미 존재): {filename}")
                continue

            try:
                click_leaf_by_label(page, label)
                wait_for_content_update(page, prev_h1)

                content = extract_content(page)
                if not content:
                    raise RuntimeError("본문 컨테이너를 찾지 못했습니다")

                markdown = html_to_markdown(content["title"], content["bodyHtml"])
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(markdown)

                prev_h1 = page.evaluate("() => document.querySelector('h1').textContent.trim()")
                success.append(filename)
                print(f"[{i}/{len(labels)}] 저장 완료: {filename}")

            except Exception as e:
                failed.append((label, str(e)))
                print(f"[{i}/{len(labels)}] 실패: {label} ({e})")

            time.sleep(REQUEST_DELAY_SEC)

        browser.close()

    print("\n===== 처리 결과 =====")
    print(f"성공: {len(success)}개")
    print(f"실패: {len(failed)}개")
    for label, err in failed:
        print(f"  - {label}: {err}")


def main():
    parser = argparse.ArgumentParser(description="nexacroN V24 레퍼런스 가이드 Markdown 크롤러")
    parser.add_argument("--limit", type=int, default=None, help="앞에서부터 N개만 처리 (테스트용)")
    parser.add_argument("--skip-existing", action="store_true", help="이미 저장된 파일은 건너뛰기")
    args = parser.parse_args()
    scrape(limit=args.limit, skip_existing=args.skip_existing)


if __name__ == "__main__":
    main()
