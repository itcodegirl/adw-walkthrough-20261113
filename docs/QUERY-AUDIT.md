# Fresh capstone query audit

Seven database call sites in the current app; none selects star. No new query from service-title typing. Source reviewed at67687d2 before documentation-only capstone changes.

| Site | Columns and scope | Write/error behavior | Execution evidence |
| --- | --- | --- | --- |
| main.js public offerings | title,description; published=true; sort_order ascending | Returned error shown before rendering; loading/error/empty separate | Actual live2rows,32 floor and public control |
| main.js personal inquiries | id,created_at,message,handled,user_id; current session owner; newest first | Returned/thrown error handled; request revision/account guard | Source inspected; real signed-in path BLOCKED |
| main.js inquiry insert | name,email,message; only actual session adds user_id | No handled/created_at/arbitraryowner, no chainedselect; try/catch/finally; read-only fields during save | Actual32live anonymous request has exactly3keys and owner-null readback |
| admin.js offerings | title,description,published,sort_order; optionalpublishedfilter; sort_order | Returned/thrown error and request/account guard | Actual anon gate-bypass/public outcomes28; real admin drafts BLOCKED |
| admin.js inquiry list | id,created_at,name,email,message,handled,user_id; optionalhandled=false; newest first | Returned/thrown error and request/account guard | Anonymous named query refused; real admin positive BLOCKED |
| admin.js handled update | only handled=true; exact inquiry id; returns only id | Requires error-null and exactly1affected row, then refetch | Direct anonymous denied-write/owner unchanged proof; actual admin button positive BLOCKED |
| admin.js role lookup | id,is_admin; exact current session user id; maybeSingle | Error/missing/non-admin distinctions and request/account guard | Source inspected; real own-profile request BLOCKED |

Grants and all applicable policies determine allowed access. Personal query filtering is view intent, especially for the admin who deliberately has broader inquiry SELECT access. Browser validation does not promise server-side email/message format checks, rate limiting or spam prevention. Public inserts are intentionally allowed with database defaults; real owner checks require the unavailable signed-in controls.
