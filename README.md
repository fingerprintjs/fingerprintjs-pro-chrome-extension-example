# FingerprintJS Pro Browser Extension Example

This repository contains example browser extension that uses FingerprintJS Pro Agent.

The extension contains **background script**, **popup** and **content script**. All of them call our Pro Agent when they are loaded.

> **Note**: Currently our Pro Agent is broken in browser extension environment, and this repository showcases the issue.

### Getting started

After cloning the repository perform these operations:

* Run `yarn install` to install dependencies
* Copy `.env.dist` to `.env` and provide `API_KEY`
* Run `yarn build` to build the extension
* Install the unpacked extension in your browser. In order to do that:
  * Head to **Manage Extensions** page in your browser
  * Click **Load unpacked**
  * Select `build` directory
  * You should see the **FingerprintJS Test Browser Extension** extension, make sure that it is activated.
