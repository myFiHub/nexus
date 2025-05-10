---
title: Build & Connect
slug: aptos/connect
---

:::info
This part of documentation is targeted to applications that want to implement nightly connect
as wallet interface.
:::

To get started, we need to connect the user to the application.
In order to do so, application generates the sessionId, a unique id that identifies each connection.

---

This process is initialized by one side displaying a sessionId through QR code (see the screenshot).
The other peer needs just to scan the QR code on its device. Extension wallets are auto detected so you are always up to date and don't need to upgrade your dapp.

![ConnectImage](../../static/img/connect.png#connectImage)

### Connect

Application builds a connection using `build()` or `buildLazy()` function that returns interface to communicated with remote user. It is important to note, that the `buildLazy()` function allows for the modal to appear even when the sessionId is still undefined. App should define `AppMetadata` so wallets will be able to show it to user.

To start sending request like `signTransaction` user first need to connect to session.
Once user establishes connection, application will get public key and the connection will be confirmed.



API of application client is fit to match currently existing standards of corresponding blockchains

```js
interface AppMetadata {
  name: string;
  url?: string;
  description?: string;
  icon?: string; // Url of app image
  additionalInfo?: string;
}
```

You may also want to specify some additional connection options. This can be achieved by creating an object that implements the below interface, and using it inside the `build()` or `buildLazy()` function. Note, that the `disableModal` property can be used for implementing a custom [External modal](../../customization/customization/external_modal).

```js
interface ConnectionOptions {
  disableModal?: boolean // default: false
    //   Used for disabling modal in case you want to use your own
  initOnConnect?: boolean // default: false
    //   Ensures that the app is only build upon running the connect function
  disableEagerConnect?: boolean // default: false
    //   Do not connect eagerly, even if the previous session is saved
}
```

```js

import { Network } from "@aptos-labs/wallet-standard";

const networkInfo = {
  chainId: 27,
  name: Network.CUSTOM,
  url: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
};

// Trigger connection
await adapter.connect()
// After connection adapter turns into remote signer

// Sign transaction
await adapter.signAndSubmitTransaction()

// Disconnect client if you want to end session
await adapter.disconnect()
```

### Disconnect

:::info
Both client and application can initiate disconnection.
User can force session termination in case of abuse.
Only when application disconnects and session is not persistent, session is completely removed.
:::


