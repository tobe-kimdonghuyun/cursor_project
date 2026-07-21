"""
nexacro_manual.chm 전체 내용을 카테고리별 MD 파일로 추출

사용법:
    python extract_all_manual.py              # 전체 추출
    python extract_all_manual.py --list       # 카테고리-파일 매핑 목록만 출력
    python extract_all_manual.py --resume     # 이미 생성된 파일 건너뜀

출력: python/output/ 폴더 (카테고리별 .md 파일)
"""

import argparse
import re
import subprocess
import tempfile
import shutil
from collections import defaultdict
from pathlib import Path
from bs4 import BeautifulSoup

CHM_FILE   = r"D:\git_prj\cursor_project\DOC\NexacroN\nexacro_manual.chm"
OUTPUT_DIR = Path(__file__).parent / "output"
SEVENZIP   = r"C:\Program Files\7-Zip\7z.exe"

# 이미 완료된 카테고리 → 덮어쓰지 않음 (--resume 없이도 건너뜀)
DONE_OUTPUT_FILES = {"Environment.md"}

# 파일명 타입 구분자
TYPE_SEPARATORS = ["_Property_", "_Method_", "_Event_", "_Style_"]
TYPE_ORDER      = {"": 0, "Property": 1, "Method": 2, "Event": 3, "Style": 4}


# ═══════════════════════════════════════════════════════════
# 1. CHM 압축 해제
# ═══════════════════════════════════════════════════════════

def extract_chm(chm_path: str, output_dir: str) -> bool:
    print(f"[1/5] CHM 압축 해제 중: {Path(chm_path).name}")
    result = subprocess.run(
        [SEVENZIP, "x", chm_path, f"-o{output_dir}", "-y"],
        capture_output=True, text=True, timeout=120
    )
    if result.returncode != 0:
        print(f"  오류: {result.stderr.strip()}")
        return False
    cnt = len(list(Path(output_dir).glob("*.html")))
    print(f"  완료: HTML 파일 {cnt}개 추출")
    return cnt > 0


# ═══════════════════════════════════════════════════════════
# 2. 파일 분류
# ═══════════════════════════════════════════════════════════

def parse_filename(filename: str) -> dict | None:
    """HTML 파일명 → {category, type, name} 추출"""
    stem = Path(filename).stem
    if not stem or stem[0] in ("#", "$"):
        return None

    type_name = ""
    name      = stem

    # 타입 구분자로 분리
    for sep in TYPE_SEPARATORS:
        if sep in stem:
            idx  = stem.index(sep)
            cat  = stem[:idx]
            type_name = sep.strip("_")
            name      = stem[idx + len(sep):]
            return {"category": cat, "type": type_name, "name": name, "stem": stem}

    # 구분자 없는 파일 → 카테고리 개요
    return {"category": stem, "type": "", "name": stem, "stem": stem}


def category_to_output_file(category: str) -> str:
    """카테고리명 → 출력 MD 파일명"""

    def sanitize(s: str) -> str:
        return re.sub(r'[\\/:*?"<>|. ]', "_", s).strip("_")

    # ── Components 계열 ──────────────────────────────────────
    if category.startswith("Components_Component_"):
        rest = category[len("Components_Component_"):]
        comp = rest.split("_")[0]
        return f"{comp}.md"

    if category.startswith("Components_ContainerComponent_"):
        rest = category[len("Components_ContainerComponent_"):]
        comp = rest.split("_")[0]
        return f"{comp}.md"

    if category.startswith("Components_Animation Objects_"):
        rest = category[len("Components_Animation Objects_"):]
        comp = rest.split("_")[0]
        return f"{comp}.md"

    if category.startswith("Components_System Component"):
        return "System_Component.md"

    if category.startswith("Components"):
        return "Components.md"

    # ── 기타 최상위 그룹 ─────────────────────────────────────
    if category.startswith("EventInfo Objects"):
        return "EventInfo_Objects.md"

    if category.startswith("DeviceAPI"):
        return "DeviceAPI.md"

    if category.startswith("Appendix"):
        return "Appendix.md"

    if category.startswith("Communication Objects"):
        return "Communication_Objects.md"

    if category.startswith("Misc. Objects"):
        return "Misc_Objects.md"

    if category.startswith("Event Objects"):
        return "Event_Objects.md"

    if category.startswith("Data Objects_DataObject"):
        return "DataObject.md"

    if category.startswith("Data Objects"):
        return "Dataset.md"

    if category.startswith("Script"):
        return "Script.md"

    if category.startswith("Frames"):
        return "Frames.md"

    if category.startswith("NexacroAPI"):
        return "NexacroAPI.md"

    if category.startswith("Application"):
        return "Application.md"

    if category.startswith("Form"):
        return "Form.md"

    # 그 외: 이름 그대로 (특수문자 제거)
    return f"{sanitize(category)}.md"


def sort_key(info: dict) -> tuple:
    """동일 출력 파일 내 정렬: 카테고리 깊이 → 카테고리명 → 타입 → 항목명"""
    depth = info["category"].count("_")
    return (depth, info["category"].lower(),
            TYPE_ORDER.get(info["type"], 99), info["name"].lower())


def collect_all(extract_dir: str) -> dict:
    """HTML 파일 전체를 출력 파일명 → [{path, info}] 로 그룹화"""
    groups: dict[str, list] = defaultdict(list)

    for html_file in Path(extract_dir).glob("*.html"):
        info = parse_filename(html_file.name)
        if info is None:
            continue
        out_file = category_to_output_file(info["category"])
        groups[out_file].append({"path": html_file, "info": info})

    # 각 그룹 내 정렬
    for key in groups:
        groups[key].sort(key=lambda x: sort_key(x["info"]))

    return dict(groups)


# ═══════════════════════════════════════════════════════════
# 3. CHM HTML 전용 파서 (Environment 스크립트와 동일 로직)
# ═══════════════════════════════════════════════════════════

SKIP_SECTIONS = {"Supported Environments", "Property Type", "Return Value Type"}


def _next_content_td(sub_title_td):
    parent_tr = sub_title_td.find_parent("tr")
    if not parent_tr:
        return None
    tr = parent_tr.find_next_sibling("tr")
    while tr:
        if tr.find("td", class_="sub_title"):
            return None
        ltd = tr.find("td", class_="list")
        if ltd:
            return ltd
        tr = tr.find_next_sibling("tr")
    return None


def _setting_syntax_to_md(table_tag) -> list:
    lines = []
    for row in table_tag.find_all("tr"):
        cells = row.find_all(["td", "th"])
        if not cells:
            continue
        try:
            is_full = int(cells[0].get("colspan", "1")) >= 3
        except ValueError:
            is_full = False

        if is_full:
            pre  = cells[0].find("pre")
            code = pre.get_text().rstrip() if pre else cells[0].get_text(strip=True)
            if code:
                lines += ["```javascript", code, "```"]
        else:
            if len(cells) >= 2:
                param    = cells[0].get_text(strip=True)
                desc_pre = cells[-1].find("pre")
                desc     = desc_pre.get_text(strip=True) if desc_pre else cells[-1].get_text(strip=True)
                if param:
                    lines.append(f"- **`{param}`** — {desc}")
    return lines


def _table_to_md(table_tag) -> list:
    lines = []
    has_header = False
    for row in table_tag.find_all("tr"):
        cells = row.find_all(["td", "th"])
        if not cells:
            continue
        vals = [c.get_text(strip=True) for c in cells]
        if not any(vals):
            continue
        if not has_header:
            lines += ["| " + " | ".join(vals) + " |",
                      "| " + " | ".join(["---"] * len(vals)) + " |"]
            has_header = True
        else:
            lines.append("| " + " | ".join(vals) + " |")
    return lines


def parse_chm_page(html_path: Path) -> str:
    raw  = html_path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(raw, "html.parser")
    lines = []

    title_td = soup.find("td", class_="title")
    title    = title_td.get_text(strip=True) if title_td else html_path.stem
    lines   += [f"### {title}", ""]

    navi_td = soup.find("td", class_="top_navi")
    if navi_td:
        navi = navi_td.get_text(strip=True)
        if navi:
            lines += [f"> {navi}", ""]

    for st in soup.find_all("td", class_="sub_title"):
        section_name = st.get_text(strip=True)
        if section_name in SKIP_SECTIONS:
            continue

        content_td = _next_content_td(st)
        if not content_td:
            continue

        lines += [f"**{section_name}**", ""]
        inner_table = content_td.find("table")
        pre_el      = content_td.find("pre", class_="list")

        if section_name == "Setting Syntax" and inner_table:
            lines += _setting_syntax_to_md(inner_table)
        elif section_name == "Example" and inner_table:
            lines += _setting_syntax_to_md(inner_table)
        elif section_name in ("Parameters", "Return Value") and inner_table:
            lines += (_table_to_md(inner_table) if not pre_el
                      else ["```", pre_el.get_text().rstrip(), "```"])
        elif pre_el:
            text = pre_el.get_text().rstrip()
            lines += (["```javascript", text, "```"] if section_name == "Syntax"
                      else [text])
        elif inner_table:
            lines += _table_to_md(inner_table)
        else:
            text = content_td.get_text(strip=True)
            if text:
                lines.append(text)

        lines.append("")

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════
# 4. 그룹 → MD 파일 생성
# ═══════════════════════════════════════════════════════════

TYPE_SECTION_LABEL = {
    "":         "개요 (Overview)",
    "Property": "속성 (Properties)",
    "Method":   "메서드 (Methods)",
    "Event":    "이벤트 (Events)",
    "Style":    "스타일 (Styles)",
}


def build_md(out_filename: str, entries: list) -> str:
    title = out_filename.replace(".md", "").replace("_", " ")
    lines = [
        f"# nexacroN V24 — {title}",
        "",
        "> 출처: `nexacro_manual.chm` 자동 추출",
        f"> 항목 수: {len(entries)}개",
        "",
        "---",
        "",
    ]

    current_category = None
    current_type     = None

    for entry in entries:
        info     = entry["info"]
        cat      = info["category"]
        type_nm  = info["type"]

        # ── 카테고리 변경 시 헤더 출력 ──────────────────────
        if cat != current_category:
            current_category = cat
            current_type     = None
            # 카테고리 제목: 가장 마지막 세그먼트만 표시
            segments = cat.replace("_Objects_", " > ").split("_")
            cat_display = " > ".join(s for s in segments if s)
            lines += [f"## {cat_display}", ""]

        # ── 타입 섹션 변경 시 헤더 출력 ─────────────────────
        if type_nm != current_type:
            current_type = type_nm
            label = TYPE_SECTION_LABEL.get(type_nm, type_nm)
            if type_nm:          # 개요는 별도 헤더 없음
                lines += [f"### {label}", ""]

        # ── 페이지 변환 ──────────────────────────────────────
        md = parse_chm_page(entry["path"])
        if md.strip():
            lines.append(md)
            lines += ["", "---", ""]

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════
# 5. 메인
# ═══════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="nexacro CHM 전체 MD 추출기")
    parser.add_argument("--list",   action="store_true", help="파일 매핑 목록만 출력")
    parser.add_argument("--resume", action="store_true", help="이미 생성된 파일 건너뜀")
    args = parser.parse_args()

    temp_dir = tempfile.mkdtemp(prefix="nexacro_full_chm_")
    try:
        # ── 압축 해제 ──────────────────────────────────────
        if not extract_chm(CHM_FILE, temp_dir):
            print("오류: CHM 압축 해제 실패")
            return

        # ── 파일 분류 ──────────────────────────────────────
        print("[2/5] 파일 분류 중...")
        groups = collect_all(temp_dir)
        total_out   = len(groups)
        total_files = sum(len(v) for v in groups.values())
        print(f"  {total_out}개 MD 파일 예정, HTML {total_files}개")

        # ── 목록 모드 ──────────────────────────────────────
        if args.list:
            print("\n--- 출력 파일 목록 ---")
            for out_name in sorted(groups.keys()):
                done = "DONE" if out_name in DONE_OUTPUT_FILES else "    "
                print(f"  [{done}] {out_name:45s} {len(groups[out_name]):4d}개")
            return

        # ── 출력 폴더 준비 ─────────────────────────────────
        print("[3/5] 출력 폴더 준비...")
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        # ── MD 파일 생성 ───────────────────────────────────
        print("[4/5] MD 파일 생성 중...")
        done_cnt = skipped_cnt = failed_cnt = 0

        for i, out_name in enumerate(sorted(groups.keys()), 1):
            out_path = OUTPUT_DIR / out_name

            # 이미 완료된 파일
            if out_name in DONE_OUTPUT_FILES:
                skipped_cnt += 1
                continue

            # resume 모드: 파일이 이미 존재하면 건너뜀
            if args.resume and out_path.exists():
                skipped_cnt += 1
                continue

            try:
                md = build_md(out_name, groups[out_name])
                out_path.write_text(md, encoding="utf-8")
                size_kb = out_path.stat().st_size / 1024
                print(f"  [{i:3d}/{total_out}] {out_name:45s} {size_kb:6.0f}KB  "
                      f"({len(groups[out_name])}개)")
                done_cnt += 1
            except Exception as e:
                failed_cnt += 1
                print(f"  [{i:3d}/{total_out}] 오류 {out_name}: {e}")

        # ── 인덱스 MD 생성 ─────────────────────────────────
        print("[5/5] 인덱스 파일 생성 중...")
        idx_lines = [
            "# nexacroN V24 — 레퍼런스 메뉴얼 인덱스",
            "",
            "> `nexacro_manual.chm` 자동 추출",
            "",
            "| 파일 | 항목 수 |",
            "| --- | --- |",
        ]
        for out_name in sorted(groups.keys()):
            count = len(groups[out_name])
            idx_lines.append(f"| [{out_name}]({out_name}) | {count}개 |")
        (OUTPUT_DIR / "README.md").write_text("\n".join(idx_lines), encoding="utf-8")

        # ── 완료 보고 ──────────────────────────────────────
        print(f"\n완료: 생성 {done_cnt}개 / 건너뜀 {skipped_cnt}개 / 오류 {failed_cnt}개")
        print(f"출력 폴더: {OUTPUT_DIR}")

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
        print("임시 파일 정리 완료")


if __name__ == "__main__":
    main()
