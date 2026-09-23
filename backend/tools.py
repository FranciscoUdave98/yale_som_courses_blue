"""Agent tools.

search_courses is a plain function tool over data/yale_som_classes.json.
web_search is OpenAI's native web search tool, attached to the agent in agent.py.
"""

from __future__ import annotations

import functools
import json
import re
from pathlib import Path

from models import Course, CourseSearchResult

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "yale_som_classes.json"
MAX_RESULTS = 15

# Day words/abbreviations -> the tokens used in the Daytimes column (M T W Th F).
_DAY_TOKENS = {
    "m": "M", "mo": "M", "mon": "M", "monday": "M",
    "t": "T", "tu": "T", "tue": "T", "tues": "T", "tuesday": "T",
    "w": "W", "we": "W", "wed": "W", "wednesday": "W",
    "th": "Th", "thu": "Th", "thur": "Th", "thurs": "Th", "thursday": "Th",
    "f": "F", "fr": "F", "fri": "F", "friday": "F",
}


@functools.lru_cache(maxsize=1)
def _load_courses() -> tuple[Course, ...]:
    rows = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    return tuple(Course.model_validate(row) for row in rows)


def _meeting_days(day_time: str) -> set[str]:
    """Day tokens in a Daytimes string such as 'M T W Th F 8:30 AM-4:30 PM'."""
    before_time = re.split(r"\d", day_time, maxsplit=1)[0]
    return set(re.findall(r"Th|M|T|W|F", before_time))


def _words(text: str) -> list[str]:
    return re.findall(r"[a-z0-9&]+", text.lower())


def search_courses(
    query: str = "",
    faculty: str = "",
    category: str = "",
    day: str = "",
    limit: int = MAX_RESULTS,
) -> CourseSearchResult:
    """Search the Yale SOM course list (data/yale_som_classes.json).

    Every word you supply must match, case-insensitively. Leave a field empty to skip it.

    Args:
        query: Free-text words matched against course title, number (e.g. "MGT 401"),
            faculty, category, type, room, session and description.
        faculty: Instructor name or part of it (e.g. "Simonsohn").
        category: Course category such as Core, EMBA, Finance, Marketing, PhD, Accounting.
        day: Meeting day, e.g. "Wednesday", "Mo", "Th".
        limit: Maximum courses to return (capped at 15).
    """
    limit = max(1, min(limit, MAX_RESULTS))
    query_words = _words(query)
    faculty_words = _words(faculty)
    category_words = _words(category)
    day_token = _DAY_TOKENS.get(day.strip().lower().rstrip("."), "") if day.strip() else ""
    if day.strip() and not day_token:
        return CourseSearchResult(
            total_matches=0, returned=0, note=f"Unrecognized day {day!r}; use Mon-Fri."
        )

    scored: list[tuple[int, Course]] = []
    for course in _load_courses():
        title_num = f"{course.title} {course.number}".lower()
        other = " ".join(
            [course.faculty, course.category, course.course_type, course.room,
             course.session, course.description]
        ).lower()
        haystack = f"{title_num} {other}"
        if not all(w in haystack for w in query_words):
            continue
        if not all(w in course.faculty.lower() for w in faculty_words):
            continue
        cat_text = f"{course.category} {course.course_type}".lower()
        if not all(w in cat_text for w in category_words):
            continue
        if day_token and day_token not in _meeting_days(course.day_time):
            continue
        # Title/number hits rank above description-only hits.
        score = sum(2 for w in query_words if w in title_num) + sum(
            1 for w in query_words if w in course.faculty.lower()
        )
        scored.append((score, course))

    scored.sort(key=lambda pair: -pair[0])
    courses = [c.for_agent() for _, c in scored[:limit]]
    note = ""
    if len(scored) > limit:
        note = f"Showing the top {limit} of {len(scored)} matches; narrow the search for more."
    return CourseSearchResult(
        total_matches=len(scored), returned=len(courses), note=note, courses=courses
    )
