import { useState } from 'react'
import type { Course } from '../api'
import HandsomeDan from './HandsomeDan'

// Realistic bulldog coat tones — each course gets a stable one based on its number.
const FUR_PALETTE = ['#b5742e', '#8b5a2b', '#d99a5b', '#5c4033', '#e8c39e', '#9a9a9a', '#c2703f']

function furColorFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return FUR_PALETTE[hash % FUR_PALETTE.length]
}

const CATEGORY_HUES: Record<string, string> = {
  Core: 'core',
  EMBA: 'emba',
  PhD: 'phd',
  Finance: 'finance',
  Economics: 'economics',
  Marketing: 'marketing',
  Accounting: 'accounting',
}

function initials(name: string): string {
  const [last = '', first = ''] = name.split(',').map((s) => s.trim())
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase() || '?'
}

function displayName(name: string): string {
  const [last, first] = name.split(',').map((s) => s.trim())
  return first ? `${first} ${last}` : name
}

function sessionLabel(session: string): string {
  return session.replace('fall-', 'Fall ').replace(/^fall$/, 'Fall (full term)')
}

export default function CourseCard({ course }: { course: Course }) {
  const [open, setOpen] = useState(false)
  const category = course['Course Category']
  const hue = CATEGORY_HUES[category] ?? 'default'
  const syllabus = course.Syllabus || course['Old Syllabus']
  const faculty = course['Faculty 1']
  const description = course['Course Description'].trim()
  const dan = furColorFor(`${course['Course Number']}${course.Section}`)

  return (
    <article className={`card card--${hue}`}>
      <HandsomeDan furColor={dan} size={76} className="card__dan" />

      <header className="card__top">
        <span className="card__number">
          {course['Course Number']}
          {course.Section ? <span className="card__section"> · §{course.Section}</span> : null}
        </span>
        <span className="chip">{category}</span>
      </header>

      <h3 className="card__title">{course['Course Title']}</h3>

      {faculty ? (
        <div className="card__faculty">
          <span className="avatar" aria-hidden>
            {initials(faculty)}
          </span>
          <span>{displayName(faculty)}</span>
        </div>
      ) : (
        <div className="card__faculty card__faculty--tba">Instructor TBA</div>
      )}

      <dl className="card__facts">
        <div>
          <dt>When</dt>
          <dd>{course.Daytimes || 'TBA'}</dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>{course.Room || 'TBA'}</dd>
        </div>
        <div>
          <dt>Session</dt>
          <dd>{sessionLabel(course['Course Session'])}</dd>
        </div>
        <div>
          <dt>Units</dt>
          <dd>{course.Units}</dd>
        </div>
      </dl>

      {description ? (
        <p className={`card__desc ${open ? 'card__desc--open' : ''}`}>{description}</p>
      ) : null}

      {open && course.faculty_bio ? (
        <p className="card__bio">
          <strong>About the instructor.</strong> {course.faculty_bio.replace(/\(\[.*?\]\(.*?\)\)/g, '').trim()}
        </p>
      ) : null}

      <footer className="card__footer">
        <span className="badge">{course['Bid Or Permission']}</span>
        <div className="card__actions">
          {syllabus ? (
            <a href={syllabus} target="_blank" rel="noreferrer">
              Syllabus ↗
            </a>
          ) : null}
          {description || course.faculty_bio ? (
            <button type="button" onClick={() => setOpen((v) => !v)}>
              {open ? 'Show less' : 'Show more'}
            </button>
          ) : null}
        </div>
      </footer>
    </article>
  )
}
