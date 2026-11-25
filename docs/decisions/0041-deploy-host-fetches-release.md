# 0041 — The host downloads the release artifact; the runner no longer pushes it over scp

## Context

The Juliet's Zeal cPanel host (CloudLinux, `jailshell`, SSH on a non-standard
port) accepts ordinary SSH commands, so the first deploy step and every
`appleboy/ssh-action` step work. But `appleboy/scp-action` failed at once
(0 s, not size-related) with `remote command exited without exit status or
exit signal`: the jail closes the scp session. `scp` exists in the jail when
used interactively, so the cause is how the host handles an scp transfer over
a non-interactive session.

A first replacement — publishing the file as a temporary GitHub Release for
the host to `curl` — was rejected by GitHub with `HTTP 403: Resource not
accessible by integration` even though the job's token showed
`Contents: write`, so it was dropped.

## Decision

The host downloads the CI artifact itself: a runner step looks up the
artifact id for `release-<sha>` on the green `ci` run, and an SSH step runs
`curl` against `api.github.com/.../actions/artifacts/<id>/zip` with the job's
short-lived `GITHUB_TOKEN`, then `unzip`s `release.tar.gz` and checks it with
`gzip -t`. The unpack and `deploy-release.sh` steps are unchanged. The deploy
job needs only `actions: read`.

## Consequences

- Works wherever plain SSH commands work, the host can reach github.com, and
  `curl` + `unzip` exist (both confirmed on this host).
- Nothing is published: no temporary release, no write permission.
- The `GITHUB_TOKEN` appears in the command run on the host for the length of
  the download; it expires when the job ends and can only read this repo's
  Actions artifacts. The host's jail hides other processes.
- Artifacts expire after 14 days; the "Find the release artifact" step says
  so plainly if the one asked for has expired — re-run `ci` for that commit.
