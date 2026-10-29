# Third-party notices

DriveMesh uses the projects listed here. DriveMesh's own code is licensed under the MIT License in [LICENSE](LICENSE). That license does not replace the licenses for third-party software, fonts, or other assets.

## Server runtime

| Component | Version in the current deployment image | License | Use |
| --- | --- | --- | --- |
| [rclone](https://github.com/rclone/rclone) | 1.60.1-DEV | MIT (Expat) | Mounts each user's Google Drive through FUSE. Copyright (C) 2012 Nick Craig-Wood. The license text is in [LICENSES/RCLONE.txt](LICENSES/RCLONE.txt). |
| [Samba](https://www.samba.org/) | 4.17.12 (Debian package) | GPL-3.0-or-later | Provides the SMB file share. Samba is copyright the Samba Team and contributors. See the [Samba license information](https://www.samba.org/samba/docs/current/man-html/samba.7.html); the installed package includes Debian copyright and license details under `/usr/share/doc/samba/`. |
| [Node.js](https://nodejs.org/) | 22.23.4 | MIT | Runs the application services. Node.js and bundled components have separate notices in the base image. |
| [PostgreSQL](https://www.postgresql.org/) | 17 (Alpine image) | PostgreSQL License | Stores account, session, and connected Drive metadata. |
| [Debian](https://www.debian.org/) | 12 (Bookworm) | Multiple licenses | Base image and runtime packages. Individual copyright and license files are retained under `/usr/share/doc/` in the server image. |
| [Alpine Linux](https://www.alpinelinux.org/) | Version supplied by `postgres:17-alpine` | Multiple licenses | PostgreSQL container base image. See the image's package copyright and license notices. |

The Dockerfiles install distribution packages at build time, so patch releases may change the exact package versions. The table records the versions inspected for the current deployed images.

## JavaScript dependencies

The versions and license identifiers below come from `package-lock.json` for DriveMesh 0.0.1. The lockfile also records transitive dependencies and their license metadata.

| Package | Version | License | Use |
| --- | --- | --- | --- |
| [Nuxt](https://github.com/nuxt/nuxt) | 4.6.3 | MIT | Web application framework. |
| [Vue](https://github.com/vuejs/core) | 3.5.44 | MIT | Frontend UI framework. |
| [Vue Router](https://github.com/vuejs/router) | 4.6.4 | MIT | Frontend routing. |
| [@nuxtjs/tailwindcss](https://github.com/nuxt-modules/tailwindcss) | 6.14.0 | MIT | Tailwind integration used at build time. |
| [Express](https://github.com/expressjs/express) | 4.22.3 | MIT | HTTP API server. |
| [cors](https://github.com/expressjs/cors) | 2.8.6 | MIT | HTTP CORS middleware. |
| [dotenv](https://github.com/motdotla/dotenv) | 16.6.1 | BSD-2-Clause | Loads environment configuration. |
| [googleapis](https://github.com/googleapis/google-api-nodejs-client) | 188.0.0 | Apache-2.0 | Google OAuth and Drive API client. |
| [node-postgres (`pg`)](https://github.com/brianc/node-postgres) | 8.23.1 | MIT | PostgreSQL client. |
| [qrcode](https://github.com/soldair/node-qrcode) | 1.5.4 | MIT | QR code generation. |
| [lucide-vue-next](https://github.com/lucide-icons/lucide) | 0.469.0 | ISC; some Feather-derived icons are MIT | UI icons. Copyright for Lucide portions belongs to Lucide Contributors; Feather portions are copyright Cole Bemis. The package license, including the Feather notice, is in [LICENSES/LUCIDE.txt](LICENSES/LUCIDE.txt). |
| [TypeScript](https://github.com/microsoft/TypeScript) | 5.9.3 | Apache-2.0 | TypeScript build tooling. |

The package manager installs other direct and transitive dependencies listed in `package-lock.json`. Each package retains its own license and copyright terms. Review the lockfile and package notices when changing dependencies.

## Fonts loaded by the web app

The web app requests General Sans from [Fontshare](https://www.fontshare.com/) and Geist and JetBrains Mono from [Google Fonts](https://fonts.google.com/). The browser fetches these fonts from those services. Their respective authors and providers retain their rights; the providers' current font licenses and terms apply.

## Google APIs and trademarks

Google Drive, Google, and related marks belong to Google LLC. The Google API client is maintained by Google and distributed under Apache-2.0. DriveMesh is an independent project and is not affiliated with or endorsed by Google.
