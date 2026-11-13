# 3.6 data query audit

Inventory at f61a85b: one client src/supabase.js:5, one importing module main.js:3, exactly two queries. Search recorded app source only, excluding dependencies and environment values.

| Query home | Which columns? | Which rows? | What writes? |
| --- | --- | --- | --- |
| initOfferings, main.js:34–38 | title, description, explicitly named | published=true ordered sort_order ascending; query expresses display intent, published policy enforces row visibility independently | none |
| submit handler, main.js:191 | no returned columns, no chained select | creates one new inquiry, no existing target rows | only name/email/message from explicit FIELDS mapping after trimmed validation; no id, created_at, handled or user_id |

Read error half is checked before rendering; empty success has its own state. Write returned errors and thrown failures are both handled; finally releases pending controls, errors retain entered values. No missing order, star or ignored error found. Keep a clean-bill audit commit instead of inventing a defect. The tiny count task will reuse returned data, retain named selection and error branch, and exercise the newly written standing instruction.

Read trace: rendered Website launch h3 → main.js:20 textContent → main.js:34–38 named published SELECT → public reads published offerings USING published=true plus four column SELECT grants → row7e51e91c-df31-4267-8b98-593dd1891f81. Companion Portfolio refresh sort2 follows sort1, now observed with two rows. Write trace: contact-name/email/message → validateName/Email/Message (64/69/76), first-invalid focus175 → Object.fromEntries181–184 restricted to FIELDS94–97 → insert191 → grants INSERT(name,email,message) and policy WITH CHECK true → owner verification of Learner22. Browser network note22-network-notes.json: real GET named fields/published/order200 and real POST only3fields201 with empty minimal response. Observer uses browser network events, not visually clicked DevTools; headers omitted.

Defense map and paper adversarial read:

- Read attack: remove or reverse published filter to ask for drafts. Query filter is easily changed by a client; the policy filters both drafts out. Actual3.5 direct false query returned200[], independent of UI. Ask for all columns instead: current narrow column grants refuse a star; the scratch table demonstrates why broad grants would expose internal_notes.
- Write attack: send handled:true or user_id/created_at from a tampered client. The form validation is bypassable and defaults only fill omitted values. Column INSERT grants exclude these fields and cause permission denied before the loose WITH CHECK(true) policy can help. The current policy does not itself block handled:true; the scratch policy demonstrates the second layer after a grant broadens. Existing3.5 grant catalog shows no forbidden columns. The optional real handled probe is omitted, so this exact payload denial is a prediction from privileges, not a new runtime receipt.
- Honest residual scope: a caller can skip our email/nonblank browser validation and submit arbitrary granted text values; NOT NULL alone does not reject blank strings and public insert intentionally permits these fields. No database email format/length, anti-spam or rate control has been added in this module. This is an open-form data-quality/abuse limitation, not an unauthorized private-data leak. UI validation helps legitimate users, not hostile input. Our rendered database strings use textContent so markup in these fields is not interpreted by this app.

No optional real attack bonus. Scratch demonstrations use synthetic tables only and will be dropped by the exact cleanup block. API SQL execution substitutes unavailable SQL Editor UI.

## Execution receipts

Scratch star block1 returned id/title/internal_notes as anon. Block2 produced permission denied for table star_demo and rolled back its grant change as a batch; root reapplied only the revoke/grant and separated named SELECT (title only returned) from star (same refusal), then reset role. Both distinct outputs are in22-root-star-separated-readback.json. Loose policy accepted handled=true; tight policy refused the same shape with new row violates row-level security policy for table policy_demo. Both errors use SQLSTATE42501, so their message text, not just the code, distinguishes the layers. These are expected demonstration errors, not curriculum failures.

Owner readback matched the real browser insert: d3982a8c-ac42-4269-a412-1de0f4807922, all three expected fields, handled=false/user_id=null/default timestamp. Standing rule written by learner; Claude read it and proposed only five lines deriving count from existing data after the error return. Reviewed before one-time Manual approval. Named selection, row filter/order and error halves remained intact. Local22-count.json passes actual2rows in four theme/width combinations, injected loading/empty/error states, heading fit and visible first keyboard focus. npm run build passed52modules. Existing heading styles unchanged. Agent omitted the standing UI keyboard reminder because it judged no controls changed; learner still checked existing visible focus. No additional prompt/code correction needed for this noninteractive change.

Separate exact cleanup verified both scratch tables null and role postgres; real application remains14grants/two policies (22-root-cleanup.json). No scratch resources remain.
