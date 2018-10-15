# [Portis](https://portis.io)



[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/portis-project/portis-sdk/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/portis.svg)](https://www.npmjs.com/package/portis)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?colorB=0E7FC0)](https://gitter.im/portis-project/Lobby)
[![Twitter](https://img.shields.io/badge/twitter-portis-blue.svg?style=flat)](https://twitter.com/portis_io)


The Portis platform provides convenient access to the [Ethereum network](https://ethereum.org/) from any web application.

## How does it work?

Your dApp (decentralized application) communicates with the Portis SDK using standard [web3.js](https://github.com/ethereum/web3.js/) API calls, meaning it will work automatically with your existing web application.

Users don’t have to install anything in advance to use your dApp. With Portis, your dApp already comes bundled with a solution by offering them a simple in-browser email/password login method which feels familiar.

<hr>

## Security

Once a user creates a wallet, it is immediately encrypted using [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode). The Portis server only stores encrypted wallets, so we can enable users to easily use the same account across different devices, all without compromising security. Every transaction is signed **client-side** by the user, meaning the Portis server only relays signed transactions (i.e it can't modify them).

Our code underwent rigorous third party security audits. The SDK is published open source because we believe that is the best way to reach a truly secure codebase. In addition, we want to involve developers as much as possible and welcome any and all comments / pull requests.

For security reasons, **dApps using Portis must run over HTTPS**.

<hr>

## Installation

To begin using Portis in your dApp, the Portis SDK JavaScript code should be loaded into your dApp's code. There are several ways to carry this out:

### npm

The recommended method of loading Portis is by installing the `portis` npm package:

```js
$ npm install portis
```

### CDN
You can also include the bundled portis.js file hosted on jsdelivr's CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/portis/dist/bundle.min.js"></script>
```

### Bower
We also provide a way to deploy Portis via bower. Useful if you want serve your own scripts (instead of depending on our CDN) and maintain a `bower.json` with a list of dependencies and versions (adding the `--save` flag would automatically add it to `bower.json`).

```js
$ bower install portis --save
```
```html
<script src="/bower_components/portis/dist/bundle.min.js"></script>
```
<hr>

## Import

Portis should be imported into the same part of the code where you initialize `web3`

### CommonJS
To use Portis with CommonJS imports:

```js
var PortisProvider = require('portis').PortisProvider;
```

### Typescript / ES2015 (ES6)
To use Portis with Typescript / ES2015 imports:

```js
import { PortisProvider } from 'portis';
```

### CDN
To use Portis from CDN:

```js
var PortisProvider = window.Portis.PortisProvider;
```

<hr>

## Registration
> When running your dApp on localhost, Portis does not require registration.

Register your dApp on the Portis platform - [https://app.portis.io/dashboard](https://app.portis.io/dashboard).

In this page, you will be able to manage all of your dApps which are powered by Portis.

Inside your dApp's info page you will see your API Key. You will need to provide that key when initializing Portis as your ```Web Provider```.

The API Key is not secret (as it is being sent from the client), its goal is to verify that the dApp using Portis has been registered and is approved.

<hr>

## Initialization

Once Portis has been imported, you should set it up as your fallback ```Web3 Provider```:

```js
// Check if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
 // Use Mist/MetaMask's provider
 web3js = new Web3(web3.currentProvider);
} else {
 // Fallback - use Portis
 web3js = new Web3(new PortisProvider({
 apiKey: 'YOUR_DAPP_API_KEY'
 }));
}

// Now you can start your app & access web3 freely:
startApp();
```

This will set Portis as the fallback for when Mist/MetaMask or any other pre-installed web3 providers are not available.

If the Portis provider was injected properly, then ```isPortis``` will return ```true```

```js
web3.currentProvider.isPortis
```
<hr>

## Usage

[Here](https://plnkr.co/edit/gHp1TrNn9GsvtYuQ3Gqn?p=preview) is an example. (Hit "Run" if you don't see anything, and make sure you either disable MetaMask or use private mode on your browser)

### Getting the user's address
If you need the user's address, perhaps to authenticate them into your website, you would use the regular `web3.eth.getAccounts` method. Nothing special here:

```js
// ES7+ async/await
const accounts = await web3.eth.getAccounts()
const [address] = accounts

// ES6 Promise
web3.eth.getAccounts().then(accounts => {
  const address = accounts[0]
})
```

Note that unlike MetaMask, Portis only supports a single wallet per account.

### Using a `personal_sign` method:

More info on `personal_sign` here: https://github.com/ethereum/go-ethereum/wiki/Management-APIs#personal_sign

Again, nothing special here! Use the regular `web3.currentProvider.sendAsync` method:

```js
web3.currentProvider.sendAsync(
  {
    id: 1,
    method: 'personal_sign',
    from: address,
    params: [data, address, password],
  },
  (err, result) => {
    if (err) {
      throw new Error(err)
    }
    authenticateUser(result.result)
  },
)
```

## Configuration Options

A configuration options object should be passed along when initializing the Portis provider:

```js
web3js = new Web3(new Portis.PortisProvider({
 apiKey: 'YOUR_DAPP_API_KEY',
 network: 'ropsten'
}));
```

### ```apiKey```
**Type:** `String`

**Default Value:** ```null```

**Required**: ```true```

The API Key of your dApp, provided in the Portis dashboard after registering your dApp.

When running your dApp on localhost, Portis does not require the API Key.

### ```network```
**Type:** `String`

**Default Value:**  `mainnet`

**Required**: ```false```

Determines which Ethereum network all web3 methods will communicate with. You can set Portis to work with any one of the following networks:
1. mainnet
1. ropsten
1. kovan
1. rinkeby
1. sokol (POA Network)
1. core (POA Network)


### ```infuraApiKey```

**Type:** `String`

**Default Value:** ```null```

**Required**: ```false```

The API Key of your Infura account. If provided, Infura will serve as the provider node for all outgoing communication with the Ethereum network.

### ```providerNodeUrl```

**Type:** `String`

**Default Value:** ```null```

**Required**: ```false```

The URL of a custom provider node. If provided, that endpoint will serve as the provider node for all outgoing communication with the Ethereum network.

The valid types are `HttpProvider`, `WebsocketProvider` and `IpcProvider`, as defined in the [web3js documentation](https://web3js.readthedocs.io/en/1.0/web3.html#value).

**Example:**

```HttpProvider```:
```js
providerNodeUrl: 'http://localhost:8545'
```

<hr>

## Methods

### ```setDefaultEmail(email: string)```

If you already know the user's email address, you can use this method to pre-populate the email field in the login and register pages.

**Example**:
```js
web3.currentProvider.setDefaultEmail('satoshi@portis.io');
```

### ```showPortis(callback: function)```

You may want to show a user their Portis account without necessarily having them carry out an action (e.g. signTransaction). Calling this method will open the Portis window. The provided callback function will be called once the window has been closed explicitly by the user.

**Example**:
```js
web3.currentProvider.showPortis(() => {
    console.log('Portis window was closed by the user');
});
```

### ```on(eventName: string, callback: function)```

The Portis provider emits events using the .on('eventName', callback) scheme.

**Example**:
```js
web3.currentProvider.on('event-type', result => {
    console.log('event-type was thrown');
});
```

### **Event types:**

#### `login`
When a DApp calls any web3 method which requires the user to login (for instance getAccounts), there is no way for the DApp to know if the callback was successful since the user just logged in to Portis successfully, or if they were already logged in, and it was invoked successfully without having to show the login window to the user.

The `login` event allow DApps to detect when a user explicitly logged in successfully to their Portis account. The callback method will return an object containing two values:
1. `provider`: will always have the value `portis`
1. `address`: the wallet address of the logged in user


#### `purchase-initiated`
When a user initiates an ETH purchase through our third-party provider, the `purchase-initiated` event is thrown.

The callback method will return an object containing two values:
1. `provider`: will always have the value `portis`
1. `purchaseId`: a unique indentifier which can be used to poll the purchase status, as documented in the [dashboard](https://app.portis.io/dashboard).



<hr>

## Account Creation

Each new account is automatically loaded with $1 worth of Ether, free of charge. Our goal is to provide the best user experience to your users, so we want to make sure that the first time they sign a transaction goes as smooth as possible.

To prevent people from abusing this mechanism, we require a phone number when creating an account (a PIN is sent via SMS to that number to complete registration).

We realize that some users might feel uncomfortable about providing their phone number. Also, this requirement poses an issue when testing, where you may want to easily generate a lot of different accounts.

Therefore, it is not mandatory to provide a phone number at the final step of registration. The new account simply won't be funded with the $1 worth of Ether.


<hr>

## Browsers support

For security reasons, Portis supports "evergreen" browsers - the last versions of browsers that automatically update themselves.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- |
| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions

<br>
<hr>

## Community

* [Gitter](https://gitter.im/portis-project/Lobby)
* [Reddit](https://www.reddit.com/r/portis)
