# Risk-Based Approval — ApplyFlow AI

Classifier tiers:
- Low (docs, flags, internal-only): 0 humans once CI + security green
- Standard (most PRs): 1 human (author can approve if trusted)
- High (auth, billing, CI/release, installers): 2 humans; CODEOWNERS required

Rules:
- Never let bot approval replace a required human; dismiss approvals on new commits
- Start strict; loosen with evidence (revert rate as guardrail)
