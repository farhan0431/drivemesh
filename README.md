<div align="center">
  <img src="packages/client/public/brand/drivemesh-logo.png" alt="DriveMesh logo" width="112">
  <h1>DriveMesh</h1>
  <p>Connect your Google Drive accounts to a private SMB share.</p>
  <p><a href="https://drivemesh.farhan-dev.my.id/">Try DriveMesh</a> · <a href="LICENSE">MIT license</a> · <a href="CONTRIBUTING.md">Contributing</a> · <a href="SECURITY.md">Security</a> · <a href="CHANGELOG.md">Changelog</a></p>
</div>

DriveMesh connects one or more Google Drive accounts to Windows File Explorer, macOS Finder, and other SMB3 clients. Create a DriveMesh account, link your Google accounts, then connect to the `DriveMesh` share with your DriveMesh username and password. Each linked Google Drive appears as its own folder.

> **Project status:** DriveMesh has not had an independent security audit. Review its security, compatibility, and recovery requirements before relying on it for important files.

## Try the hosted instance

You can try DriveMesh at [drivemesh.farhan-dev.my.id](https://drivemesh.farhan-dev.my.id/) without setting up a server.

1. Open the site and select **Create account**. Register with a DriveMesh username and password, or select **Sign in** if you already have an account.
2. In the dashboard, select **Connect Google Drive**. Sign in to Google and grant the requested access. Repeat this step to link additional Google accounts.
3. Wait until each Drive appears as **Ready** in the dashboard. Each connected account gets its own folder in your share.
4. Connect from your device with the same DriveMesh username and password you use on the website.

   **Windows File Explorer**

   Enter this address in File Explorer's address bar:

   ```text
   \\drivemesh.farhan-dev.my.id
   ```

   Select the `DriveMesh` share. When Windows asks for credentials, enter your DriveMesh username and password.

   **macOS Finder**

   Select **Go → Connect to Server** or press `⌘K`, then enter:

   ```text
   smb://drivemesh.farhan-dev.my.id
   ```

   Choose **Registered User**, sign in with your DriveMesh credentials, then select `DriveMesh`.

   **iPhone and iPad**

   In Files, select **Browse → Connect to Server**, enter `smb://drivemesh.farhan-dev.my.id`, choose **Registered User**, and sign in with your DriveMesh credentials. Then select `DriveMesh`.

5. Open the folder for the Google Drive you want to use. Create folders and save files inside it. Uploads may continue in the background after a file operation finishes, so check Google Drive before assuming an upload is complete.

SMB access requires TCP port 445. Some networks and internet providers block that port. Google sign-in also depends on the app's OAuth configuration and Google approval requirements. Read the hosted instance's [Privacy Policy](https://drivemesh.farhan-dev.my.id/privacy) and [Terms of Service](https://drivemesh.farhan-dev.my.id/terms) before using it.

To run your own instance, follow the [prerequisites](#prerequisites) and [installation](#installation) below.

## Features

- Separate DriveMesh accounts and web sessions, with an Indonesian and English dashboard.
- Multiple Google Drive connections per account, each shown as a separate folder.
- SMB3 with encryption, and per-account directories and FUSE mounts.
- Google OAuth with state and PKCE. Refresh tokens are encrypted in the database.
- Connection guides for Windows, macOS, and iOS, plus Privacy Policy and Terms of Service pages.

## Architecture

```text
Windows / macOS / iOS ── encrypted SMB3 ──> DriveMesh ── HTTPS ──> Google Drive
Browser                ── HTTPS ──────────> DriveMesh dashboard
```

Samba handles SMB authentication. Rclone mounts each Google Drive through FUSE. The Express server handles accounts and OAuth, PostgreSQL stores account and connection data, and Nuxt serves the web interface. Users sign in to DriveMesh with their DriveMesh credentials, never their Google password.

### File storage and limitations

Files being created or changed may be stored temporarily in a persistent write cache on the server. DriveMesh does not encrypt cache contents. Access is restricted to server processes with the required privileges. An SMB write can finish before the background upload to Google Drive does. Check that uploads have completed, especially before restarting the server, disconnecting a Drive, or relying on an important file. Some filesystem operations behave differently on Google Drive than on a local disk.

## Prerequisites

- A Linux server with Docker, Docker Compose, and `/dev/fuse`.
- Administrative access to load the included AppArmor profile on hosts that use AppArmor.
- A domain for the web app and SMB, an HTTPS reverse proxy with a certificate, and TCP port 445 forwarded to the server. An HTTP reverse proxy does not carry SMB traffic, and some networks block port 445.
- A Google Cloud project with the Google Drive API enabled and an OAuth client of type **Web application**. Add Google accounts as test users if the consent screen is in testing mode.

## Installation

1. Clone the repository and create an environment file:

   ```bash
   git clone https://github.com/farhan0431/drivemesh.git
   cd drivemesh
   cp .env.example .env
   ```

2. Edit `.env` and set `DOMAIN`, `SMB_HOST`, `SMB_BIND_ADDRESS`, `POSTGRES_PASSWORD`, `MASTER_KEY`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. `DOMAIN` is the web hostname without a scheme; `SMB_HOST` is the SMB hostname without a port. `SMB_BIND_ADDRESS` defaults to `127.0.0.1`, which accepts connections only from the server. Set it to the appropriate server interface address for device access. Use unique secrets. Keep `MASTER_KEY` unchanged so the server can decrypt existing tokens. Never commit `.env`.

3. In Google Cloud, register this redirect URI for your domain:

   ```text
   https://<DOMAIN>/api/auth/google/callback
   ```

   Configure the OAuth consent screen, public homepage, Privacy Policy (`/privacy`), and Terms of Service (`/terms`) to match your deployment and Google's requirements. Google may require verification for Drive scopes. Replace the operator details in the legal pages when deploying your own instance.

4. On hosts that use AppArmor, review and load the included profile. Configure the host to load it at startup:

   ```bash
   sudo apparmor_parser -r docker/apparmor/drivemesh-fuse.profile
   ```

   The profile limits FUSE mounts to `/mnt/drivemesh/users/*/*/`. Changing `MOUNT_POINT` requires a matching profile update.

5. Configure an HTTPS reverse proxy to `127.0.0.1:3080`, then start the services:

   ```bash
   docker compose up -d --build
   docker compose ps
   ```

   Compose publishes the web app, API, and PostgreSQL on localhost. SMB listens on `SMB_BIND_ADDRESS`. Production trusts one reverse proxy (`TRUST_PROXY=1`); configure it to forward the client address correctly. Restrict network access with a firewall where possible.

6. Open `https://<DOMAIN>`, create an account, and connect Google Drive from the dashboard. Use your DriveMesh username and password on your devices:

   - **Windows:** Enter `\\<SMB_HOST>` in File Explorer and select `DriveMesh`. For Map Network Drive, use `\\<SMB_HOST>\DriveMesh`.
   - **macOS:** In Finder, select **Go → Connect to Server** and enter `smb://<SMB_HOST>/DriveMesh`.
   - **iOS:** In Files, select **Connect to Server** and enter the SMB address shown in the dashboard.

The share opens to a list of your connected Drives. Create folders and save files inside the Google Drive folder you want to use.

## Security and operations

- The `DriveMesh` share maps each user to a private directory. A Google account can only be linked to one DriveMesh account at a time. A hidden share named after the username remains available for compatibility.
- SMB3 encryption is required. Your web password also authenticates SMB. The minimum password length is six characters; use a longer, unique password. Restrict inbound TCP port 445 with a firewall where possible, and monitor server logs.
- Google refresh tokens are encrypted with `MASTER_KEY`. While a Drive is mounted, rclone also needs a local token configuration readable only by root. The write cache is not encrypted by DriveMesh. Metadata, logs, memory, swap, and backups may contain user data as well.
- Run one server instance per database and Samba volume. The server container runs Samba and FUSE as root with `SYS_ADMIN` and `/dev/fuse`. Use an isolated host and keep its software up to date.
- `drivemesh-pgdata` stores accounts and encrypted tokens. `drivemesh-samba` stores Samba authentication data. `drivemesh-write-cache` stores pending writes, including files that may not have uploaded yet. Back up these volumes with `MASTER_KEY` when needed and restrict access to the backups. The 4 GiB cache setting guides cleanup. Active and pending files can take the cache beyond that size.
- Users cannot recover passwords or delete accounts themselves. You can disconnect a Google Drive from the dashboard. If Google token revocation fails, revoke DriveMesh access from your Google account's security settings.

See [SECURITY.md](SECURITY.md) for vulnerability reports and the [migration guide](docs/migrasi-server.md) for upgrades from the legacy single-share setup.

## Development and testing

This repository uses npm workspaces: `packages/client` (Nuxt 4), `packages/server` (Express and TypeScript), and `packages/shared` (shared types). The Dockerfiles use Node.js 22.

```bash
npm ci
npm run build
```

Integration tests require a dedicated PostgreSQL test database whose name includes `test`. Do not use a production database.

```bash
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/drivemesh_test \
  npm run test:integration --workspace=@drivemesh/server
```

These tests mock Google and the Samba gateway. Changes to SMB or FUSE still need testing on Linux with real clients. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process.

## License

DriveMesh is available under the [MIT License](LICENSE). Third-party names and trademarks belong to their respective owners.
