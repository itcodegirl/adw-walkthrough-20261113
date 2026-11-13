# Module 2 checkpoint

This is a simulated learner app, based on a labeled synthetic Course-1 portfolio.

- Contract: Jenna Studio's local-business offer, two projects, services, process, FAQ, About and honest form demo are present. Restored the keep-list's primary Start a project link to the contact section after the audit found it had drifted to a selected-work jump. The form clearly says it does not send or store data.
- Tokens: zero unapproved raw hex, font-family or spacing values outside token blocks. Structural zero/auto and the 40rem media condition are justified. Each theme has one accent definition; changing it requires rechecking the filled-button pair.
- Reading: form state is field values, validation classes/ARIA, messages and status. Blur checks one field and clears stale status; submit checks all, focuses the first invalid field or gives an honest local confirmation. Nav state is the page key; loading the shared shell marks the matching link. No backend exists yet.
- Floor: both pages at 390/1280 in light/dark passed keyboard focus, first-invalid focus, labels/error associations, heading/landmark and measured text-contrast checks. No images exist. Physical phone and screen-reader experience remain unverified; browser emulation and DOM checks are narrower evidence.
- History: eleven specific imperative module commits explain the progression from tokens through sections, shell, validation and themes. No history rewritten. Future messages should name behavior changes as well as verification.

Receipts: dark theme added 21 lines in the token layer only. Missing prior nav timing was deliberately exercised from clean commit 1d9f445a33a56561e5590cfb82c1ecc39101f7c0; one temporary shared NAV entry worked by keyboard from both pages at phone/desktop widths in 2.514 seconds, including branch/edit/automated checks. Harness preparation preceded timing, so this is execution evidence, not beginner pacing. Removed only that link, rechecked both pages and matched every tracked file hash before returning to the checkpoint branch. Temporary link was never committed or pushed. The simulated full-scroll contract reading took 25.962 seconds; no independent human stranger participated.

Standing review: AGENT-SAFETY-CARD.md sits beside CLAUDE.md. Walk what each diff touched and run the full walk at checkpoints. Token architecture and OS-respecting token-swap theming are two deliberate decisions that keep future changes inspectable.

The shell still lacks real persistence: the contact form validates but cannot save an enquiry. Module 3 supplies that data layer.
