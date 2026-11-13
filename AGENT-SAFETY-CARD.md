# AGENT SAFETY CARD

Tell the agent:

Work only on [scope].
Do not change [files/areas].
Before editing, explain which files you plan to touch.
After editing, summarize the diff and name how I should test it.
If you are unsure, ask before changing architecture.

Stop the agent if:
- It changes unrelated files.
- It rewrites working code without a clear reason.
- It adds a dependency without explaining why.
- It hides errors instead of fixing them.
- It asks for secret values in chat.
