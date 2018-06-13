# Refundable ICO (RICO) prototype

This repository exists to test the refundable ICO idea,
described in the technical white paper for the LUKSO Blockchain.

The base idea is as follows:

1. Allocation phase: Investor contribute ETH and receive ICO commitment tokens (ICT) to prrof their participation.


- Investors can refund any time by sending back the ICT, and will recieve back their ETH.


2. Distribution phase: ETH flow to the ICO project over a fixed period of time

- Investors can refund, but will only get the part of the ETH back, based on the current point in time, in the distribution period. 
- Refund works by sending the ICT back to the RICO smart contract
- The RICO smart contract will send ETH and *locked* ICT (not refundable again) back to the sender.
- The ratio of refund is always based on time passed inside the distribution period, meaning if an investor joins late, he will immediately only be able to refund parts of their investment.


## Manual testing

Simple load the `test.html` in your browser, load the console and create a new `RICO` instance with a certain ICT/ETH ratio:

```js
var rico = new RICO(1); // ETH/ ICT ratio: 1
// Hardcoded: total ICT 10000, total blocks in RICO: 1000
```

And run test manually by committing from and refunding from accounts:

```js
var project = {
    ETH: 0
};

var accounts = [{
    ETH: 100,
    ICT: 0,
    ICTL: 0
},{
    ETH: 200,
    ICT: 0,
    ICTL: 0
},{
    ETH: 1000,
    ICT: 0,
    ICTL: 0
},{
    ETH: 8000,
    ICT: 0,
    ICTL: 0
}];

// commit 100 ETH
rico.commit(accounts[0], 100);

// check the current status
rico.log();

// pass time
rico.currentBlock = 500;

// check the current status
rico.log();

// refund 50 ICT
rico.refund(accounts[0], 50);

// check the current status
rico.log();
```


## Run tests 

Go into your repository and run:

```
$ npm install
$ npm install -g mocha // make sure mocha is globally installed
```

To run tests, run:

```
$ npm test
```


