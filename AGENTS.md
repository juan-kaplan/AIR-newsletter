<!-- BEGIN ECC -->
# Everything Claude Code (ECC) - Agent Instructions

This project follows the repository instructions supplied at project start:

- TypeScript throughout.
- pnpm workspaces.
- Cloudflare Worker + D1 for subscribe, unsubscribe, and admin APIs.
- Resend + React Email for weekly newsletter sending.
- No real secrets in source.
- Keep the implementation small, readable, and safe for a 30-person weekly newsletter.
<!-- END ECC -->

<!-- BEGIN OMNI CODEX -->
## Omni shared memory

This repo is connected to Omni through MCP tools registered by the `omni` CLI. The `omni` shell command is not required inside Codex and may not be on PATH.

Use the Omni MCP tools directly; when Codex is launched through `omni`, these tools are registered and pre-approved. Do not inspect `.omni`, read `~/.omni/credentials.json`, run `command -v omni`, or call the Omni HTTP API with `curl`, Python, or Node for normal project-context questions.

At the start of a Codex session, call `omni_project_bootstrap` to load the current project, teammate roster, and recent shared context. For "what is the team up to?" or similar status questions, call `omni_team_pulse` first.

Use `omni_memory_search`, `omni_memory_global_search`, and `omni_teammate_context` before answering questions about prior decisions, teammate work, blockers, deployment, architecture, or project conventions.

Support Omni @mentions the same way the desktop app does. When the user includes a token like `@name`, resolve it against the `omni_project_bootstrap` roster by matching the token case-insensitively against the start of the first word of their display name. Ignore unknown tokens. For each resolved unique teammate, call `omni_teammate_context` with that teammate's agent id and a query made from the user prompt after removing the resolved @mentions and collapsing whitespace. Use those teammate-specific results as primary context before answering.

Use `omni_memory_write` sparingly for durable decisions, resolved blockers, and non-obvious context future sessions should remember.

If Omni MCP tools are not visible, use tool discovery/search for `omni` MCP tools. If they are still unavailable, say that Omni MCP is unavailable in this Codex session and ask the user to restart Codex through `omni`; do not fall back to raw credential or HTTP probing unless the user explicitly asks to debug the integration.
<!-- END OMNI CODEX -->
