# Project Rules

Standing rules for all work in this project.

## Accessibility and markup

- Use semantic landmarks: `header`, `main`, and `footer`.
- Every form field has an associated `label`.
- Every image has meaningful alt text.
- Layouts are readable and responsive at phone width and up.
- Keyboard focus is always visible.

## Content and tone

- Preserve existing content unless a task says to change it.
- Keep the friendly, direct tone of the existing text.

## Scope

- Keep each task small and focused on what was asked.
- Keep all work inside this project folder.
- Use only local built-in tools. No remote integrations.
- Ask before running edits or shell commands that need approval.

## Data and privacy

- No real personal data, other people's information, or secrets in tasks or test content.
- Invent placeholders when sample data is needed.
- Queries name their columns — no select star; every query handles its error half.
- Inquiry inserts send name, email and message. Signed-out inserts omit user_id. Signed-in inserts may add only the current session user's id; the WITH CHECK policy verifies it. Never accept handled, created_at or an arbitrary owner from form input.

## Git

- Do not commit or push unless explicitly asked.
- Do not add AI attribution (co-author lines, "generated with" notes, or similar) to any Git-visible surface: commit messages, PR descriptions, or files.
- For any later authorized commit, use this author identity:

  ```
  itcodegirl <88835851+itcodegirl@users.noreply.github.com>
  ```

- Suggest a commit after each verified working change; never leave large edits uncommitted. The learner reviews and makes the commit.
- Work happens on branches; propose commits after verified changes; keep diffs scoped to the task.
- All colors, fonts, and spacing come from the :root tokens; never write raw values in components; propose a new token if one is missing. Structural keywords and the documented media-condition literal are justified exceptions.

## Accessibility floor (every generation)
- semantic landmarks; heading levels never skip
- every image gets meaningful alt (empty alt only if truly decorative)
- every text/background pair clears 4.5:1: use only pairs recorded as verified in style.css, and text on a filled accent or primary surface uses that surface's own on-color token
- every input has a visible, associated label; errors linked via aria-describedby
- all interactive elements keyboard-reachable with VISIBLE focus styles — never remove outlines without replacement
- after UI changes, remind me to run the keyboard walk on affected areas
- walk what the diff touched, full walk at checkpoints; record the verification in the commit message

## Secrets
- Never write key values into any committed file; use environment references only. Documentation uses placeholders, not the real project URL or key values.
- New credentials get a blast-radius note: what could a holder do?
- Flag a task that appears to need the secret key. It belongs server-side; this app has no trusted server yet. Never read .env files to fill documentation.
