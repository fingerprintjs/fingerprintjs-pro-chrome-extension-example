# Contributing to FingerprintJS Pro Chrome Extension Example

## Working with code

We prefer using [yarn](https://yarnpkg.com/) for installing dependencies and running scripts.

The main branch is locked for the push action. For proposing changes, use the standard [pull request approach](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). It's recommended to discuss fixes or new functionality in the Issues, first.

### Packages

This repository contains three packages:

- chrome-extension: Provides sample extension that consists of popup page, background, and content script.
- chrome-extension-e2e: E2E Tests for a chrome extension that tests its functionality in a real browser.
- website: Example website that uses the FingerprintJS Pro JavaScript agent as it normally would, and communicates with Chrome extension.

### How to build

Just run:

```shell
yarn build
```

It will build a website and chrome extension.

### Code style

The code style is controlled by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). Run to check that the code style is ok:

```shell
yarn lint
```

You aren't required to run the check manually, the CI will do it. Run the following command to fix style issues (not all issues can be fixed automatically):

```shell
yarn lint:fix
```

### How to test

There are e2e tests for browser extension stored in `packages/chrome-extension-e2e/` that are powered by [Playwright](https://playwright.dev/).
To start them run:

```shell
yarn run extension:e2e
```

> The e2e tests also install third party extensions ([uBlock](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en), [Ghostery](https://chrome.google.com/webstore/detail/ghostery-%E2%80%93-privacy-ad-blo/mlomiejdfkolichcflejclcbmpeaniij?hl=en)) to ensure that they don't impact how our extension works.

### Commiting changes

We follow [Conventional Commits](https://conventionalcommits.org/) for committing changes. We use git hooks to check that the commit message is correct.

### How to deploy the website

The website is automatically deployed to Github Pages on every release with tag website-v${VERSION}.

### How to publish chrome extension

Chrome extension is published to Chrome Web Store on every release with tag chrome-extension-v${VERSION}.
