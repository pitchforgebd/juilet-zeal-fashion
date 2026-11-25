# Host facts needed from the human (before the first real deploy)

**Re-checked 2026-11-25 for the Juliet's Zeal host (`julietsz`, bdix13).**
§1–§4 below are confirmed from output the owner pasted; the only open items
are the GitHub secrets themselves. (This file started life answering the same
questions for the UniBaazar host; the values below are the new host's.)

I can't connect to the production server or run anything on it myself (the
master plan forbids this). The CI/CD pipeline this phase builds is written to
best-practice defaults for a CloudLinux/cPanel + Passenger host, but a few
facts can only come from the actual host. Please run the commands below in
cPanel → **Terminal** (or SSH, if you already have it set up) and paste the
output back. Nothing here is destructive — these are all read-only checks.

## 1. OpenSSL version (determines Prisma's binary target) — ✅ answered

`openssl version` → **OpenSSL 3.5.9**. `/etc/os-release` is hidden by
cPanel's CageFS jail, but the disk is `almalinux-root` and CloudLinux's
`alt-nodejs*` stack and `cloudlinux-selector` are present, so this is a
CloudLinux 9 (RHEL-family) host like the UniBaazar one.
`binaryTargets = ["native", "rhel-openssl-3.0.x"]` in `prisma/schema.prisma`
already covers it — Prisma groups engines by OpenSSL major version, so 3.5.9
maps to the same `rhel-openssl-3.0.x` target (see
`docs/decisions/0026-prisma-binary-target-rhel.md`).

## 2. Node.js version available via Node Selector — ✅ answered

`/opt/alt` lists `alt-nodejs20`, `22`, `24` and `26` (plus older ones), and
`/usr/sbin/cloudlinux-selector` exists. Use **20.x**, matching `.nvmrc` and
CI. The cPanel dropdown should agree; double-check it when creating the app
(§6 of `DEPLOYMENT.md`).

## 3. Your home directory and app path — ✅ answered

cPanel account `julietsz`, home directory `/home/julietsz` (Node.js 20–26,
MariaDB 11.4, shared IP 115.187.19.26). `APP_PATH` is
therefore `/home/julietsz/julietszeal`, used as-is in `DEPLOYMENT.md` and
`docs/launch-checklist.md`.

## 4. SSH access for GitHub Actions — ✅ key authorized; secrets pending

SSH Access is enabled on the plan. The key `github-deploy` was generated in
cPanel → _Security_ → _SSH Access_ → _Manage SSH Keys_ and authorized:
`~/.ssh/authorized_keys` and `github-deploy.pub` are both present. A
passphrase is required on this host, so the GitHub secret `SSH_PASSPHRASE` is
needed as well as `SSH_KEY`. The private key and passphrase go directly into
GitHub's secrets UI (see `docs/deploy/github-secrets.md`) and are never
pasted into chat. The host does **not** use port 22 (closed, confirmed) — its SSH port is
**57813**, so the GitHub secret `SSH_PORT` must be `57813`.

Also confirmed on this host: `tar`, `mysql` and `mysqldump` exist (MariaDB
client 11.4.14), `bash` is present, and the home volume has ~3 TB free.

If your plan doesn't support SSH access at all, tell me — there's a
documented fallback (cPanel's Git Version Control deploy, §3.4 of the master
plan) that doesn't need SSH, and I'll build that path instead.

## 5. A staging subdomain, for a dry run — skipped by choice

This was originally written to test the deploy mechanism itself (a
migration plus a forced-failure rollback) against a disposable target
before trusting it with the real site. **Waived for the same reason as
the migration rehearsal** (`docs/decisions/0025-migration-rehearsal-waived-fresh-install-instead.md`):
there's no real data at risk — the production DB holds only demo data,
and the plan is a fresh install, not an in-place upgrade. The worst case
of a first-deploy failure here is the site staying down until it's
retried, not data loss, and setting up a whole second subdomain + Node
app + database just to rehearse that is more setup than the risk
justifies. If a real need for a staging environment comes up later
(e.g. before a risky future migration), revisit this section then.
