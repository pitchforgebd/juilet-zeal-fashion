# 0041 — The host downloads the release; the runner no longer pushes it over scp

## Context

The Juliet's Zeal cPanel host (CloudLinux, `jailshell`, SSH on a non-standard
port) accepts ordinary SSH commands, so the first deploy step and every
`appleboy/ssh-action` step work. But `appleboy/scp-action` failed at once
(0 s, not size-related) with `remote command exited without exit status or
exit signal`: the jail closes the scp session. `scp` exists in the jail when
used interactively, so the cause is how the host handles an scp transfer over
a non-interactive session, not a missing binary.

## Decision

Replace the scp step with: (1) the runner publishes `release.tar.gz` as a
short-lived pre-release (`deploy-<sha>`) on this repository; (2) the host
fetches it with `curl` (or `wget`) over HTTPS and verifies a SHA-256 computed
on the runner; (3) an `always()` step deletes the release and its tag. The
unpack and `deploy-release.sh` steps are unchanged.

## Consequences

- Works wherever plain SSH commands work and the host can reach github.com.
- The repository is public, and the file is build output of that public
  code (no `.env`, no secrets), so a minutes-long public download exposes
  nothing new. If the repository is ever made private, the host's `curl`
  would need an authenticated URL — revisit this then.
- The deploy job now needs `contents: write` (publish/delete the release)
  and `actions: read` (download the CI artifact); both are declared on the job.
- A failed run can leave a `deploy-<sha>` release behind if the runner is
  killed; the next run for that sha deletes it first, and it can be removed
  by hand from the repository's Releases page.
