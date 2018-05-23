# [Portis](https://portis.io)

The Portis platform provides convenient access to the Ethereum network from any web application.

## How does it work?

Your dApp communicates with the Portis SDK using standard [web3.js](https://github.com/ethereum/web3.js/) API calls, meaning it will work automatically with your existing web application.

Users don’t have to install anything in advance to use your dApp. With Portis, your dApp already comes bundled with a solution by offering them a simple in-browser username/password login method which feels familiar.

<hr>

## Security

Once a user creates a wallet, it is immediately encrypted using [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode). The Portis server only stores encrypted wallets, so we can enable users to easily use the same account across different devices, all without compromising security. Every transaction is signed **client-side** by the user, meaning the Portis server only relays signed transactions (i.e it can't modify them).

Our code underwent rigorous third party security audits. It is published open source because we believe that is the best way to reach a truly secure codebase. In addition, we want to involve developers as much as possible and welcome any and all comments / pull requests.

<hr>

## Installation

Add the Portis SDK to your package.json

    npm install portis

Register your dApp on the Portis platform - [https://app.portis.io/dashboard](https://app.portis.io/dashboard).

Inside your dApp's info page you will see your API Key. You will need to provide that key when initializing Portis as your ```Web Provider```.

```js
const Portis = require('portis');

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
} else {
    // Fallback - use Portis
    web3js = new Web3(new Portis.PortisProvider({
        apiKey: YOUR_DAPP_API_KEY
    }));
}

// Now you can start your app & access web3 freely:
startApp()
```

This will set Portis as the fallback for when Mist/MetaMask or any other pre-installed web3 providers are unavailable.

If the Portis provider was injected properly, then ```isPortis``` will return ```true```

```js
web3.currentProvider.isPortis
```
<hr>

## Configuration Options

### A configuration options object should be passed along when initializing the Portis provider:

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
