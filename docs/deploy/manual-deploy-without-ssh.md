# Deploying without SSH from GitHub (manual path)

Use this when GitHub's `deploy` workflow can't reach the server — e.g. the
host doesn't accept SSH from outside (`dial tcp …: connect: connection
refused` in the first deploy step). It does exactly what the workflow does,
by hand: put the CI-built release on the server, unpack it, and run the same
`scripts/deploy/deploy-release.sh` (database backup → migrations → switch →
restart → health check → automatic rollback). Everything is done from your
browser: GitHub, cPanel File Manager and cPanel Terminal.

## Before you start (once)

- `~/julietszeal/shared/.env` exists with real secrets (`DEPLOYMENT.md` §3).
- **AutoSSL has been issued** for the domain (cPanel → SSL/TLS Status → Run
  AutoSSL). The health check calls `https://…/api/health` and rolls the
  deploy back if the certificate is invalid.
- The Node.js app exists in cPanel (Setup Node.js App): version 20.x,
  Production, root `julietszeal/current`, URL the domain, startup `server.js`.
- The domain's DNS points at this server.

## Each deploy

**1. Get the release from GitHub.** Repo → **Actions → ci** → open the green
run for the commit you want → scroll to **Artifacts** → download
`release-<full commit sha>` (about 300 MB). Unzip it on your PC; inside is
`release.tar.gz`. Artifacts expire after 14 days — re-run `ci` if needed.

**2. Upload it.** cPanel → **File Manager** → `julietszeal/incoming` →
**Upload** → `release.tar.gz`. (If the upload is refused for size, tell
whoever maintains the repo — don't unzip it on the server.)

**3. Create the helper script (first time only).** cPanel → **Terminal**:

```bash
cat > ~/julietszeal/manual-deploy.sh <<'EOF'
#!/bin/bash
# Usage: manual-deploy.sh <full commit sha>
set -euo pipefail
export SHA="$1"
export APP_PATH="$HOME/julietszeal"
export HEALTH_CHECK_URL="https://julietszealfashionhouse.com/api/health"
cd "$APP_PATH"
rm -rf "releases/$SHA"
mkdir -p "releases/$SHA"
tar -xzf incoming/release.tar.gz -C "releases/$SHA"
rm -f incoming/release.tar.gz
bash "releases/$SHA/scripts/deploy/deploy-release.sh"
EOF
```

**4. Run it in the background** (unpacking ~38,000 small files can take
10+ minutes and a browser terminal may disconnect), with the commit's full
sha:

```bash
nohup bash ~/julietszeal/manual-deploy.sh <full-commit-sha> > ~/julietszeal/deploy.log 2>&1 &
tail -f ~/julietszeal/deploy.log
```

`Ctrl+C` stops only the `tail`; the deploy keeps running. Success ends with
`Deployed <sha> successfully.` A failed health check prints
`Smoke test failed — rolling back` and restores the previous release.

**5.** cPanel → Setup Node.js App → **Restart**, then open
`https://julietszealfashionhouse.com/api/health`.

## Rollback

Same as `DEPLOYMENT.md` "Rollback": `scripts/deploy/rollback.sh` (read it
first; it needs `APP_PATH` set like above).
