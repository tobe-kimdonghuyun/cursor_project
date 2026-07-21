"""
nexacro_manual.chm에서 Environment 관련 내용을 추출하여 MD 파일로 변환

사용법:
    python extract_environment_manual.py

출력:
    nexacro_environment_manual.md  (스크립트와 같은 폴더)
"""

import os
import re
import subprocess
import tempfile
import shutil
from collections import Counter
from pathlib import Path
from bs4 import BeautifulSoup

CHM_FILE = r"D:\git_prj\cursor_project\DOC\NexacroN\nexacro_manual.chm"
OUTPUT_FILE = Path(__file__).parent / "nexacro_environment_manual.md"
SEVENZIP = r"C:\Program Files\7-Zip\7z.exe"

# 파일명 패턴 → (섹션명, 정렬순서)
SECTION_MAP = [
    ("Environment.html",                                          "개요 (Overview)",                  0),
    ("Environment_Property_",                                     "속성 (Properties)",                1),
    ("Environment_Method_",                                       "메서드 (Methods)",                  2),
    ("Environment_Event_",                                        "이벤트 (Events)",                   3),
    ("EventInfo Objects_EnvironmentUserHotkeyEventInfo.html",     "EnvironmentUserHotkeyEventInfo",   4),
    ("EventInfo Objects_EnvironmentUserHotkeyEventInfo_",         "EnvironmentUserHotkeyEventInfo",   4),
    ("NexacroAPI_Method_getEnvironment",                          "NexacroAPI 관련 메서드",             5),
    ("NexacroAPI_Method_getEnvironmentVariable",                  "NexacroAPI 관련 메서드",             5),
    ("NexacroAPI_Method_removeEnvironmentVariable",               "NexacroAPI 관련 메서드",             5),
    ("NexacroAPI_Method_setEnvironmentVariable",                  "NexacroAPI 관련 메서드",             5),
    ("Appendix_Constant_Environment",                             "부록: Environment 상수",             6),
]

# sub_title 건너뛸 섹션
SKIP_SECTIONS = {"Supported Environments", "Property Type", "Return Value Type"}


def extract_chm(chm_path: str, output_dir: str) -> bool:
    """7-Zip으로 CHM 파일 압축 해제"""
    print(f"[1/4] CHM 압축 해제 중: {Path(chm_path).name}")
    result = subprocess.run(
        [SEVENZIP, "x", chm_path, f"-o{output_dir}", "-y"],
        capture_output=True, text=True, timeout=120
    )
    if result.returncode != 0:
        print(f"  오류: {result.stderr.strip()}")
        return False
    html_count = len(list(Path(output_dir).rglob("*.html")))
    print(f"  완료: HTML 파일 {html_count}개 추출")
    return html_count > 0


def classify_file(filename: str):
    """파일명으로 섹션 분류. 미매칭이면 None 반환"""
    for pattern, section, order in SECTION_MAP:
        if filename == pattern or filename.startswith(pattern):
            return section, order
    return None


def collect_environment_files(extract_dir: str) -> list:
    """압축 해제 폴더에서 Environment 관련 파일 수집"""
    collected = []
    for html_file in Path(extract_dir).iterdir():
        if html_file.suffix.lower() not in (".html", ".htm"):
            continue
        result = classify_file(html_file.name)
        if result is None:
            continue
        section, order = result
        collected.append({"path": html_file, "section": section, "order": order, "name": html_file.stem})
    collected.sort(key=lambda x: (x["order"], x["name"]))
    return collected


# ─────────────────────────── CHM HTML 전용 파서 ───────────────────────────

def _next_content_td(sub_title_td):
    """sub_title td 다음에 오는 class='list' td를 반환. 없으면 None"""
    parent_tr = sub_title_td.find_parent("tr")
    if not parent_tr:
        return None
    tr = parent_tr.find_next_sibling("tr")
    while tr:
        # 다른 sub_title이 나오면 중단
        if tr.find("td", class_="sub_title"):
            return None
        ltd = tr.find("td", class_="list")
        if ltd:
            return ltd
        tr = tr.find_next_sibling("tr")
    return None


def _pre_text(tag) -> str:
    """pre.list 요소의 텍스트 반환"""
    pre = tag.find("pre", class_="list") if tag else None
    return pre.get_text() if pre else ""


def _setting_syntax_to_md(table_tag) -> list:
    """Setting Syntax 테이블 → Markdown 줄 목록"""
    lines = []
    rows = table_tag.find_all("tr")
    for row in rows:
        cells = row.find_all(["td", "th"])
        if not cells:
            continue
        colspan_val = cells[0].get("colspan", "1")
        try:
            is_fullrow = int(colspan_val) >= 3
        except ValueError:
            is_fullrow = False

        if is_fullrow:
            # 코드 예제 행
            pre = cells[0].find("pre")
            code = pre.get_text().rstrip() if pre else cells[0].get_text(strip=True)
            if code:
                lines.append("```javascript")
                lines.append(code)
                lines.append("```")
        else:
            # 파라미터 정의 행 (이름 | 설명)
            if len(cells) >= 2:
                param = cells[0].get_text(strip=True)
                desc_pre = cells[-1].find("pre")
                desc = desc_pre.get_text(strip=True) if desc_pre else cells[-1].get_text(strip=True)
                if param:
                    lines.append(f"- **`{param}`** — {desc}")
    return lines


def _param_table_to_md(table_tag) -> list:
    """Parameters / Return Value 테이블 → Markdown"""
    lines = []
    rows = table_tag.find_all("tr")
    for row in rows:
        cells = row.find_all(["td", "th"])
        if len(cells) < 2:
            continue
        # 헤더 행 (bgcolor 속성으로 구분)
        if cells[0].get("bgcolor") and cells[0].get_text(strip=True).lower() in ("name", "parameter", "파라미터"):
            headers = [c.get_text(strip=True) for c in cells]
            lines.append("| " + " | ".join(headers) + " |")
            lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
        else:
            vals = [c.get_text(strip=True) for c in cells]
            lines.append("| " + " | ".join(vals) + " |")
    return lines


def _enum_table_to_md(table_tag) -> list:
    """Enum/Values 테이블 → Markdown"""
    lines = []
    has_header = False
    for row in table_tag.find_all("tr"):
        cells = row.find_all(["td", "th"])
        if not cells:
            continue
        texts = [c.get_text(strip=True) for c in cells]
        if not any(texts):
            continue
        if not has_header:
            lines.append("| " + " | ".join(texts) + " |")
            lines.append("| " + " | ".join(["---"] * len(texts)) + " |")
            has_header = True
        else:
            lines.append("| " + " | ".join(texts) + " |")
    return lines


def parse_chm_page(html_path: Path) -> str:
    """CHM 레퍼런스 페이지를 Markdown 문자열로 변환"""
    raw = html_path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(raw, "html.parser")

    lines = []

    # ── 제목 ──────────────────────────────────────────────
    title_td = soup.find("td", class_="title")
    title = title_td.get_text(strip=True) if title_td else html_path.stem
    lines += [f"### {title}", ""]

    # 상단 네비게이션 경로
    navi_td = soup.find("td", class_="top_navi")
    if navi_td:
        navi = navi_td.get_text(strip=True)
        lines += [f"> {navi}", ""]

    # ── 섹션 파싱 ─────────────────────────────────────────
    for st in soup.find_all("td", class_="sub_title"):
        section_name = st.get_text(strip=True)

        if section_name in SKIP_SECTIONS:
            continue

        content_td = _next_content_td(st)
        if not content_td:
            continue

        lines.append(f"**{section_name}**")
        lines.append("")

        inner_table = content_td.find("table")
        pre_el = content_td.find("pre", class_="list")

        if section_name == "Setting Syntax" and inner_table:
            md_lines = _setting_syntax_to_md(inner_table)
            lines += md_lines

        elif section_name in ("Parameters", "Return Value") and inner_table:
            # 파라미터/반환값은 단순 pre가 있을 수도 있고 표가 있을 수도 있음
            if pre_el:
                lines += ["```", pre_el.get_text().rstrip(), "```"]
            else:
                lines += _param_table_to_md(inner_table)

        elif section_name == "Example" and inner_table:
            # 예제 테이블
            md_lines = _setting_syntax_to_md(inner_table)
            lines += md_lines

        elif section_name in ("Enum", "Values", "Return Value Type") and inner_table:
            lines += _enum_table_to_md(inner_table)

        elif pre_el:
            # 일반 pre 블록 (Description, Syntax, Remark 등)
            text = pre_el.get_text().rstrip()
            if section_name in ("Syntax",):
                lines += ["```javascript", text, "```"]
            else:
                lines.append(text)

        elif inner_table:
            # 기타 테이블 → 내부 텍스트 추출
            text = inner_table.get_text(separator="\n", strip=True)
            if text:
                lines.append(text)

        else:
            text = content_td.get_text(strip=True)
            if text:
                lines.append(text)

        lines.append("")

    return "\n".join(lines)


# ─────────────────────────── Markdown 조립 ───────────────────────────────

def build_markdown(file_entries: list) -> str:
    sections: dict[str, list] = {}
    for entry in file_entries:
        sec = entry["section"]
        if sec not in sections:
            sections[sec] = []
        sections[sec].append(entry)

    lines = [
        "# nexacroN V24 — Environment 레퍼런스 메뉴얼",
        "",
        "> 출처: `nexacro_manual.chm` 자동 추출",
        f"> Environment 관련 항목 {len(file_entries)}개",
        "",
        "---",
        "",
    ]

    # 목차
    lines.append("## 목차")
    lines.append("")
    for sec in sections:
        count = len(sections[sec])
        lines.append(f"- [{sec}](#{sec.replace(' ', '-').replace('(', '').replace(')', '')}) ({count}개)")
    lines.append("")
    lines.append("---")
    lines.append("")

    # 섹션별 본문
    for sec, entries in sections.items():
        lines.append(f"## {sec}")
        lines.append("")

        for entry in entries:
            md = parse_chm_page(entry["path"])
            if md.strip():
                lines.append(md)
                lines.append("")
                lines.append("---")
                lines.append("")

    return "\n".join(lines)


# ─────────────────────────── 메인 ────────────────────────────────────────

def main():
    temp_dir = tempfile.mkdtemp(prefix="nexacro_env_chm_")
    try:
        if not extract_chm(CHM_FILE, temp_dir):
            print("오류: CHM 압축 해제 실패")
            return

        print("[2/4] Environment 관련 파일 수집 중...")
        entries = collect_environment_files(temp_dir)
        if not entries:
            print("  오류: 파일을 찾지 못했습니다.")
            return
        print(f"  수집 완료: {len(entries)}개 파일")
        counts = Counter(e["section"] for e in entries)
        for sec in sorted(counts):
            print(f"    {sec}: {counts[sec]}개")

        print("[3/4] Markdown 변환 중...")
        md_content = build_markdown(entries)
        print(f"  완료: {len(md_content):,}자")

        print(f"[4/4] 저장 중: {OUTPUT_FILE}")
        OUTPUT_FILE.write_text(md_content, encoding="utf-8")
        size_kb = OUTPUT_FILE.stat().st_size / 1024
        print(f"  저장 완료: {size_kb:.1f} KB")

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
        print("\n임시 파일 정리 완료")


if __name__ == "__main__":
    main()
