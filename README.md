# Kinde SvelteKit

The Kinde SDK for SvelteKit.

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) [![Kinde Docs](https://img.shields.io/badge/Kinde-Docs-eee?style=flat-square)](https://kinde.com/docs/developer-tools) [![Kinde Community](https://img.shields.io/badge/Kinde-Community-eee?style=flat-square)](https://thekindecommunity.slack.com)

## Development

### Initial set up

1. Clone the repository to your machine:

   ```bash
   git clone https://github.com/kinde-oss/kinde-sveltekit-sdk
   ```

2. Go into the project:

   ```bash
   cd kinde-sveltekit-sdk
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

### How to build

Implement your modifications and then execute the below command to compile the SDK:

```bash
npm run build
```

### How to add the SDK into an already existing project

1. Go to the project's root directory, then execute the below command:

   ```bash
   npm pack <path-to-sdk-folder>
   // e.g
   npm pack ~/Documents/Projects/kinde-sveltekit-sdk
   ```

2. Update the package.json file

   ```json
   {
        ...
        "dependencies": {
            "@kinde-oss/kinde-sveltekit-sdk": "file:kinde-oss-kinde-sveltekit-sdk-<version>.tgz",
            ...
        }
        ...
   }
   ```

### How to test

Firstly, you need to install a web browser for testing purposes

```bash
// https://playwright.dev/docs/library#key-differences

npx playwright install
// for a single one
npx playwright install chromium
```

Next step, create `.env` file:

```bash
KINDE_AUDIENCE=your_kinde_api
KINDE_CLIENT_ID=your_kinde_client_id // Please use an application with password method
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your_kinde_domain.kinde.com
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:4173
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:4173
KINDE_REDIRECT_URL=http://localhost:4173/api/auth/kinde_callback
KINDE_SCOPE=profile email offline openid
KINDE_USER_EMAIL_TEST= // An user has existed in your organization
KINDE_USER_PASSWORD_TEST=
```

Finally, you can simply run the command

```bash
npm run test
```

<!-- ## Documentation

For details on integrating this SDK into your project, head over to the [Kinde docs](https://kinde.com/docs/) and see the [SvelteKit SDK](<[link-to-kinde-doc](https://kinde.com/docs/developer-tools/)>) doc 👍🏼. -->

## Publishing

The core team handles publishing.

## Contributing

Please refer to Kinde’s [contributing guidelines](https://github.com/kinde-oss/.github/blob/489e2ca9c3307c2b2e098a885e22f2239116394a/CONTRIBUTING.md).

## License

By contributing to Kinde, you agree that your contributions will be licensed under its MIT License.
