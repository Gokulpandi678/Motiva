# Motiva — Feature Reference

A personal growth tracker for IT/tech work: log tickets you resolve, turn them into a
searchable FAQ, track what you learn (tech or not), see which skills you're actually
building reps in, keep track of who you're building relationships with, and manage the
regular to-dos around all of it.

This document describes **what exists today** — every field the app asks you for, every
view it shows you, and every API endpoint behind it — so you have a precise baseline to
plan improvements from. It is not a roadmap; ideas for what to build next are collected
in their own section at the end.

## Stack

| Layer | Choice |
|---|---|
| Backend | Node.js + Express + TypeScript, layered architecture (`routes → controllers → services → repositories`) |
| Database | PostgreSQL (Supabase-hosted), via raw `pg` (node-postgres) — no ORM. Migrations are plain `.sql` files run by a small custom migration runner (`server/src/scripts/migrate.ts`) |
| Validation | Zod schemas at every route boundary |
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS v4, CSS-variable design tokens (light/dark, validated categorical/status palette), Plus Jakarta Sans font, Framer Motion for animation throughout (buttons, drawers, modals, toasts, table rows, sidebar nav) |
| Frontend state | Jotai (cross-cutting UI state: theme, sidebar, toasts, quick capture) + TanStack Query (all server data) |
| Frontend architecture | A config-driven "Resource" system — one generic Table/Form/FilterBar/Page, reused across Tickets, Tasks, Learnings, Relationships, FAQs via per-resource config objects |
| Auth | None. Single-user personal tool. |

Folders: `server/` (API), `client/` (UI), `server/postman/` (Postman collection for manual API testing).

---

## 1. Ticket / Issue Log

**What it captures**, per ticket:

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | text, 3–200 chars | yes | shows a "similar ticket" nudge as you type (see below) |
| Problem | text | yes | "What was wrong" |
| Status | `OPEN` / `IN_PROGRESS` / `RESOLVED` | yes | defaults to `OPEN`; drives the activity timeline |
| Resolution | text | only to mark Resolved | "What fixed it" — the API rejects a transition to `RESOLVED` if this is blank |
| Difficulty | `EASY` / `MEDIUM` / `HARD` | yes | defaults to `MEDIUM`; shown as a colorful segmented pill picker, not a dropdown |
| Time spent | minutes (positive int) | yes | defaults to 0 |
| Tags | free-text list | no | shared tag pool with Learnings — this is what feeds Skill Growth |
| Generate FAQ | boolean | create-only | if checked, auto-drafts a FAQ entry immediately (only takes effect if the ticket is created already Resolved with a resolution filled in) |

**Similar-ticket nudge**: while typing a title, the form calls a fuzzy-match endpoint
(Postgres `pg_trgm` `similarity()` over ticket titles) and — above a similarity floor —
shows the closest past match with a one-click "copy tags & difficulty" action, so repeat
issues don't require retyping the same metadata.

**Ticket detail drawer**: opening a ticket (rather than just editing its fields) shows a
richer view: status can be changed inline from a dropdown, plus two derived panels:
- **Timeline** — every activity on the ticket, newest first. `CREATED` and
  `STATUS_CHANGE` entries are logged automatically; you can also add your own `NOTE`,
  `CALL`, `EMAIL`, or `ESCALATION` entries, and delete any entry.
- **Tasks** — a quick-add list of tasks linked to this ticket (see Tasks below), so a
  ticket that needs several follow-up steps doesn't have to live entirely in your head.

**What's shown** (table view): title + truncated problem, a status badge, a difficulty
badge (Easy=good/green, Medium=warning/amber, Hard=critical/red), tag chips (each tag
gets a deterministic color from a hash of its name), formatted time spent ("1h 30m"), a
"Generated" badge if a FAQ already exists for that ticket, and the log date. Filterable
by tag (search), status (dropdown), and difficulty (dropdown). Each row can be opened
(detail drawer), edited, deleted, or — if it has no FAQ yet — you can generate one on
demand via a row action.

**API**: `POST/GET /tickets`, `GET/PATCH/DELETE /tickets/:id`, `POST /tickets/:id/faq`
(generate or regenerate), `GET /tickets/similar?title=&limit=&excludeId=`,
`GET/POST /tickets/:id/activities`, `DELETE /tickets/:id/activities/:activityId`.

---

## 2. Auto-FAQ Generation

FAQs are never created directly — they only exist as a derivative of a ticket. A FAQ is
always tied 1:1 to the ticket it came from (regenerating one **overwrites** it rather
than creating a duplicate).

**Generation logic** (`faq.service.ts`): `question = "How do you resolve: {ticket
title}?"`, `answer = ticket.resolution`, verbatim. There is no rewriting, summarizing, or
editing of the ticket's own text at generation time — that happens after the fact, by you.

**What you can do after generation**: edit the question/answer text (e.g. to generalize
it beyond the one incident), delete it, or search across all FAQs.

**What's shown**: a table of all FAQs (question + truncated answer + date added), with a
full-text search box across both question and answer. No create button — the only way in
is via a ticket.

**API**: `GET /faqs`, `GET/PATCH/DELETE /faqs/:id`. (Creation lives under
`POST /tickets/:id/faq`.)

---

## 3. Learning Log

Learning isn't limited to ticket work — it's logged separately, and **isn't limited to
tech**. Each entry has a `domain` field precisely so a "Spanish" or "guitar" learning
doesn't get mixed into your tech-skill analysis.

**What it captures**, per learning:

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | text, 3–200 chars | yes | "What did you learn" |
| Domain | free text, ≤100 chars | yes | autocomplete against domains you've actually used, plus a fixed suggestion list — not a locked enum, see below |
| Source | text, ≤200 chars | no | course, doc, colleague, etc. |
| Notes | text | no | |
| Confidence | 1–5 | yes | star picker, defaults to 3; shows a live "x/5" label next to the stars |
| Tags | free-text list | no | same shared tag pool as Tickets — chip picker with autocomplete against most-used tags |

**Domain** is a free-text field with autocomplete suggestions (not an enum): Technology,
Language, Music, Finance, Health & Fitness, Cooking, Personal Development, Business,
Other. You can type anything — these are just prompts. Each domain renders as a
consistently-colored badge everywhere in the app (the color is a deterministic hash of
the domain name, so "Language" is always the same color without needing to hardcode a
mapping). Domains can be renamed/merged after the fact — see Tags & Domains Admin below.

**What's shown**: a table of all learnings — title + source, domain badge, confidence as
filled stars, tag chips, log date. Filterable by tag and by domain (both search boxes).
Two extra header controls:
- **"Low confidence only"** toggle — swaps to entries with confidence ≤ 3 (hardcoded
  threshold, both in the UI call and as the API's own default), described as "revisit
  these before the details fade."
- **"By topic"** link — jumps to the Topics view (below).

**API**: `POST/GET /learnings`, `GET/PATCH/DELETE /learnings/:id`,
`GET /learnings/low-confidence?threshold=&page=&limit=`,
`GET /learnings/topics?domain=`, `GET /learnings/topics/:tag`.

### 3a. Topics — recency across repeated logs

Because you can log against the same tag many times (e.g. "spanish" logged every week),
the Topics view groups all learnings by tag and shows continuity over time — regardless
of domain, so a tech topic and a hobby topic are treated the same way.

**What's shown**: one row per tag that's ever had a learning logged against it —
domain badge(s) it's associated with, total log count, latest confidence (stars), and a
"last touched" badge colored by recency:

| Days since last log | Badge tone |
|---|---|
| ≤ 14 days | good (green) |
| ≤ 45 days | warning (amber) |
| &gt; 45 days | critical (red) |

Rows are sorted **most-stale-first** by default. A domain filter narrows the list
(computed client-side from whatever domains are actually present in your data — not a
fixed list). Clicking a row opens a timeline drawer: every log against that topic,
newest first, with confidence, notes, and source per entry — the actual "I learned this,
then revisited it, then revisited it again" history.

**API**: same `/learnings/topics` endpoints as above.

---

## 4. Skill Growth View

Fully derived, read-only — there is no manual "skill" entry anywhere. It's computed
purely from the tag pool shared by **Tickets + Learnings** (this is the one view that
intentionally does *not* separate by domain — it's the tech-career-facing view, and tags
used only by non-tech learnings still show up here if they're also used on a ticket).

**What's shown**:
- **"Reps by skill"** — a horizontal bar chart of your top 10 tags by total reps
  (ticket count + learning count against that tag), single accent color, hover tooltip
  breaking down ticket vs. learning counts and last-touched time.
- **"Blind spots"** — tags untouched in the last 30 days (API default; the dashboard
  card itself asks for only the top 8 rather than the API's default of 10). Each shown
  with a "Stale · &lt;time ago&gt;" warning badge, or a "Never touched" critical badge if
  it has no activity at all.
- **"All skills" table** — every tag with ticket count, learning count, total reps, and
  last-touched time, for the full picture beyond just the top 10.

**API**: `GET /skills` (full derived list, no params), `GET /skills/blind-spots?days=&limit=`
(defaults: 30 days, 10 rows).

---

## 5. Relationship / Network Log

**What it captures**, per interaction:

| Field | Type | Required | Notes |
|---|---|---|---|
| Person | text, ≤200 chars | yes | autocompletes against people already logged, surfacing their last interaction as a memory-jog |
| Interaction type | `HELPED` / `PAIRED_WITH` / `LEARNED_FROM` | yes | no default — you must pick one |
| Context | text | no | "What did you work on together?" |
| Notes | text | no | |
| Follow-up date | date | no | quick-pick chips (Tomorrow / +3 days / +1 week / +1 month) plus a raw date input |
| Follow-up done | boolean | edit-only | only appears once the record exists |

**What's shown**: a table — person name + truncated context, an interaction-type badge
(Helped=aqua, Paired with=violet, Learned from=orange — fixed categorical colors, never
reassigned), and a follow-up badge:

| State | Badge |
|---|---|
| No follow-up date set | — |
| Done | good, "Done · &lt;date&gt;" |
| Not done, date has passed | critical, "Overdue · &lt;date&gt;" |
| Not done, date in the future | neutral, plain date |

Filterable by interaction type. A **"Due follow-ups only"** header toggle swaps to
everything overdue-or-due (`followUpDone: false` and `followUpDate <= now`), sorted
most-overdue-first.

**API**: `POST/GET /relationships`, `GET/PATCH/DELETE /relationships/:id`,
`GET /relationships/follow-ups/due?page=&limit=`, `GET /relationships/people?q=&limit=`
(autocomplete source for the Person field).

---

## 6. Tasks

Regular to-dos, independent of the ticket/learning/relationship logs but optionally
linked to a ticket. A task can exist entirely standalone (a plain personal to-do) or be
attached to a ticket (`ticketId` set) to track a follow-up step without polluting the
ticket's own fields.

**What it captures**, per task:

| Field | Type | Required | Notes |
|---|---|---|---|
| Title | text, 3–200 chars | yes | "What needs doing?" |
| Description | text | no | |
| Priority | `LOW` / `MEDIUM` / `HIGH` | yes | defaults to `MEDIUM`; colorful segmented pill picker |
| Status | `TODO` / `IN_PROGRESS` / `DONE` | yes | defaults to `TODO` |
| Due date | date | no | quick-pick chips + raw date input |
| Ticket | link | no | set automatically when added from a ticket's detail drawer; otherwise absent (standalone) |

**What's shown**: a table — title + truncated description, priority badge, status badge,
a due-date badge (critical-toned if overdue and not done), and a "Ticket" badge if
linked. Filterable by status and priority. A **"Due only"** header toggle swaps to
everything overdue-or-due today, across both standalone and ticket-linked tasks. Tasks
can also be added and checked off inline from within a ticket's detail drawer, without
leaving the ticket.

**API**: `POST/GET /tasks`, `GET/PATCH/DELETE /tasks/:id`, `GET /tasks/due?page=&limit=`.

---

## 7. Tags & Domains Admin

A dedicated page for cleaning up the shared vocabulary that Tickets, Learnings, and
Skill Growth all depend on — typos and near-duplicate tags/domains no longer have to
live with you forever.

**Tags table**: every tag with ticket count, learning count, and total usage count.
Per-row actions:
- **Rename** — changes the tag's name everywhere it's used.
- **Merge** — folds this tag into another existing tag (picked from a searchable list);
  every ticket/learning that used the old tag now points at the target tag, and the old
  tag is removed. Done as a single transaction.
- **Delete** — removes the tag from every ticket/learning that used it.

**Domains table**: every domain with learning count and last-used date. The only action
is **Rename**, which folds every learning using the old domain name into the new one
(e.g. fixing "tech" → "Technology" retroactively across your whole history).

**API**: `GET /tags?q=&limit=`, `PATCH /tags/:id` (rename), `POST /tags/:id/merge`,
`DELETE /tags/:id`, `GET /learnings/domains?q=&limit=`, `POST /learnings/domains/rename`.

---

## 8. Quick Capture

A global fast-entry bar (`Ctrl/Cmd + K` from anywhere in the app) for logging something
in one typed line instead of opening a full form. It never saves directly — it always
lands you in the normal create form, prefilled, so anything the parser guessed wrong is
easy to fix before saving.

**Syntax** — one line, starting with a verb:

| Prefix | Opens | Parsing behavior |
|---|---|---|
| `resolved: title, resolution #tag1 #tag2` | New Ticket | text before the first comma → title; after → resolution; `#word` tokens → tags (stripped from the text) |
| `learned: title, from source #tag` | New Learning | `from X` → Source field; otherwise the remainder after the comma → Notes |
| `met: person, context, follow up friday` | New Relationship | first segment → Person; next → Context; a trailing `follow up <phrase>` → Follow-up date. Interaction type is guessed from the context text ("pair…" → Paired with, "learn…" → Learned from, else Helped) |

**Date phrases** understood in `follow up …`: `today`, `tomorrow`, `next week`, a weekday
name (`friday` → the next occurrence), `+N days`, `+N weeks`.

---

## 9. Dashboard

The landing page — five stat cards plus three recent-activity lists:

| Stat card | Source |
|---|---|
| Tickets logged | total ticket count |
| Tasks due | count of overdue/due tasks; card turns critical-toned if &gt; 0, good-toned if 0 |
| Learnings to revisit | count with confidence ≤ 3 (same hardcoded threshold as the Learnings toggle) |
| Follow-ups due | count of overdue/due relationships; card turns critical-toned if &gt; 0, good-toned if 0 |
| Top skill | the #1 entry from Skill Growth (tag + total reps) |

Below that: **Recent tickets** (last 5, status badge, links to Tickets), **Tasks due**
(last 5, priority badge, links to Tasks), and **Follow-ups due** (last 5, interaction
badge, links to Relationships) — all three built from one shared `ActivityListCard`
component.

---

## Design system

- **Config-driven Resource system** — `ResourcePage` / `ResourceForm` / `ResourceFilterBar`
  / `ResourceFormDrawer` are generic components driven entirely by a per-resource config
  object (columns, filters, form fields, create/update mappers). Tickets, Tasks,
  Learnings, Relationships, and FAQs all reuse the same components; adding a field to a
  form is a config change, not a new component.
- **Form field types**: `text`, `textarea`, `number`, `quick-number` (preset chips +
  custom input, e.g. time spent), `select` (native dropdown), `segmented` (colorful pill
  picker for short, tone-coded option sets like Priority/Difficulty), `tags` (chip picker
  with autocomplete), `domain` / `person` (autocomplete pickers with live search),
  `boolean` (switch), `date` / `quick-date` (preset chips + raw date input), `rating`
  (star picker). Compact field types auto-pair two-to-a-row; textareas, tag pickers, and
  switches always take a full row.
- **Color language**: every tag/domain gets a deterministic color from a hash of its
  name; status-like enums (ticket status, task status/priority, difficulty, interaction
  type) use a fixed, curated tone (never reassigned) so the same badge always means the
  same thing across the app.
- **Motion**: Framer Motion powers button/badge hover-tap feedback, drawer/modal/toast
  enter-exit transitions, table row stagger-in, and the sidebar's active-nav indicator.
- **Theming**: light/dark toggle (Jotai-backed, persisted), including the sidebar, which
  fully follows the toggle rather than staying fixed-dark.

---

## Data model

```
Tag ──┬── many-to-many ── Ticket
      └── many-to-many ── Learning

Ticket ── one-to-one (optional) ── Faq            (cascade delete)
Ticket ── one-to-many ── TicketActivity            (cascade delete)
Ticket ── one-to-many (optional link) ── Task       (cascade delete)

Relationship  (standalone — no tag relationship)
```

- **Tag** is the single shared vocabulary between Tickets and Learnings. It's what makes
  Skill Growth and Topics possible without any manual "skill" bookkeeping — tag once
  when you log, get the aggregation for free. Tags can be renamed, merged, or deleted
  via the Tags & Domains admin page.
- **Learning.domain** is a separate, single-value free-text field (not a Tag) — it
  classifies *what kind of learning this was*, orthogonal to *what specific thing* (the
  tags) it was about. Domains can be renamed (folding one into another) via the same
  admin page.
- **Faq** always belongs to exactly one Ticket; deleting the ticket deletes its FAQ.
- **TicketActivity** is an append-only (except manual delete) log entry belonging to one
  ticket; `CREATED`/`STATUS_CHANGE` entries are system-generated, the rest are manual.
- **Task** optionally belongs to one Ticket (`ticketId` nullable); deleting the ticket
  deletes its linked tasks. Standalone tasks are unaffected by anything ticket-related.
- **Relationship** doesn't participate in tagging at all — it's fully independent of the
  Skill Growth / Topics machinery.

## Full API reference

| Resource | Method | Path |
|---|---|---|
| Tickets | POST, GET | `/api/v1/tickets` |
| | GET | `/api/v1/tickets/similar` |
| | GET, PATCH, DELETE | `/api/v1/tickets/:id` |
| | POST | `/api/v1/tickets/:id/faq` |
| | GET, POST | `/api/v1/tickets/:id/activities` |
| | DELETE | `/api/v1/tickets/:id/activities/:activityId` |
| FAQs | GET | `/api/v1/faqs` |
| | GET, PATCH, DELETE | `/api/v1/faqs/:id` |
| Learnings | POST, GET | `/api/v1/learnings` |
| | GET | `/api/v1/learnings/low-confidence` |
| | GET | `/api/v1/learnings/topics` |
| | GET | `/api/v1/learnings/topics/:tag` |
| | GET | `/api/v1/learnings/domains` |
| | POST | `/api/v1/learnings/domains/rename` |
| | GET, PATCH, DELETE | `/api/v1/learnings/:id` |
| Skills | GET | `/api/v1/skills` |
| | GET | `/api/v1/skills/blind-spots` |
| Relationships | POST, GET | `/api/v1/relationships` |
| | GET | `/api/v1/relationships/follow-ups/due` |
| | GET | `/api/v1/relationships/people` |
| | GET, PATCH, DELETE | `/api/v1/relationships/:id` |
| Tasks | POST, GET | `/api/v1/tasks` |
| | GET | `/api/v1/tasks/due` |
| | GET, PATCH, DELETE | `/api/v1/tasks/:id` |
| Tags | GET | `/api/v1/tags` |
| | PATCH | `/api/v1/tags/:id` |
| | POST | `/api/v1/tags/:id/merge` |
| | DELETE | `/api/v1/tags/:id` |

All list endpoints accept `page` (default 1) and `limit` (default 20, max 100 — 500 for
the Tags/Domains admin endpoints) and return `{ success, data, meta: { page, limit,
total, totalPages } }`. Non-list endpoints return `{ success, data }`. Errors return
`{ success: false, message, details? }`.

## Hardcoded thresholds (worth knowing if you're tuning behavior)

| Value | Where | Currently |
|---|---|---|
| Low-confidence cutoff | API default + both frontend call sites | 3 (out of 5) |
| Skill blind-spot window | API default | 30 days |
| Skill blind-spot row count | API default 10, but the Skills page dashboard card asks for only | 8 |
| Topic recency bands | frontend only (`topic.utils.ts`) | ≤14d good, ≤45d warning, &gt;45d critical |
| Relationship "overdue" | frontend only | any follow-up date before *now*, no grace window |
| Similar-ticket floor (backend) | `ticket.repository.ts`, `pg_trgm` similarity() | &gt; 0.2 (candidates returned at all) |
| Similar-ticket nudge floor (frontend) | `SimilarTicketNudge.tsx` | ≥ 0.35 (before the nudge UI is shown) |
| Tags/Domains admin list size | frontend admin page request | up to 500 (API max) |
| Dashboard recent-item lists | frontend | 5 items each |
| List page size | frontend, every resource page | 20 |

None of these are user-configurable yet — they're constants in code, not settings.

## Known gaps / things not yet built

- **No auth** — single-user, no accounts, no way to share the FAQ/knowledge base with
  peers yet (mentioned as a future goal in the original concept).
- **No settings/config UI** — every threshold in the table above requires editing code
  and redeploying, not a form.
- **No notifications** — "due follow-ups", "due tasks", and "low confidence" are
  pull-based (you have to open the app); nothing pushes a reminder.
- **No trend-over-time charts** — Skill Growth and Topics both show current totals /
  latest state, not a history graph of reps or confidence over time (the data exists —
  `createdAt` per entry — it's just not visualized as a trend yet).
- **No export** — no CSV/JSON export of any log for backup or use outside the app.
- **No recurring tasks** — every task is a one-off; no repeat/recurrence rule.
- **Domain and Tag are still free text at entry time** — rename/merge (Tags & Domains
  admin) now gives you a manual fix-up path, but there's still no enforcement of
  consistent casing at the point of typing, so "tech" and "Technology" can still be
  created as distinct entries until you notice and merge them.
