# [Portis](https://portis.io)

The Portis platform provides convenient access to the Ethereum network from any web application.

## How does it work?

Your dApp communicates with the Portis SDK using standard [web3.js](https://github.com/ethereum/web3.js/) API calls, meaning it will work automatically with your existing web application.

Users don’t have to install anything in advance to use your dApp. With Portis, your dApp already comes bundled with a solution by offering them a simple in-browser email/password login method which feels familiar.

<hr>

## Security

Once a user creates a wallet, it is immediately encrypted using [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode). The Portis server only stores encrypted wallets, so we can enable users to easily use the same account across different devices, all without compromising security. Every transaction is signed **client-side** by the user, meaning the Portis server only relays signed transactions (i.e it can't modify them).

Our code underwent rigorous third party security audits. The SDK is published open source because we believe that is the best way to reach a truly secure codebase. In addition, we want to involve developers as much as possible and welcome any and all comments / pull requests.

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

Register your dApp on the Portis platform - [https://app.portis.io/dashboard](https://app.portis.io/dashboard).

In this page, you will be able to manage all of your dApps which are powered by Portis.

Inside your dApp's info page you will see your API Key. You will need to provide that key when initializing Portis as your ```Web Provider```.

> When running your dApp on localhost, Portis does not require the API Key.

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

The API Key of your dApp, provided in the Portis dashboard.

### ```network```
**Type:** `String`

**Default Value:**  `mainnet`

**Required**: ```false```

Determines which Ethereum network all web3 methods will communicate with. You can set Portis to work with any one of the following networks:
1. mainnet
1. ropsten
1. kovan
1. rinkeby


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

<hr>

## Account Creation

Each new account is automatically loaded with $1 worth of Ether, free of charge. Our goal is to provide the best user experience to your users, so we want to make sure that the first time they sign a transaction goes as smooth as possible.

To prevent people from abusing this mechanism, we require a phone number when creating an account (a PIN is sent via SMS to that number to complete registration).

We realize this poses an issue when testing, where you may want to easily generate a lot of different accounts. To overcome this issue, we created the following page:

https://app.portis.io/test-user

There you can create as many accounts as you like, they simply won't be funded with the $1 (so there's no need for SMS validation).

<hr>

## Community

* [Gitter](https://gitter.im/portis-project/Lobby)
* [Reddit](https://www.reddit.com/r/portis)
