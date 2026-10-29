---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, ask.

Call the Skill tool with "tdd" where possible, at pre-agreed seams.

Run typechecking as appropriate and tests related to the changed code. Run the full test suite only when requested or needed to verify the change's impact; report what was run.

Once done, call the Skill tool with "code-review" to review the work.

Commit your work to the current branch.
