var chai = require('chai');
var RICO = require('./refundable2.js');
var assert = chai.assert;





// rico.commit(1, 130);
// rico.commit(2, 180);

// rico.blockNumber = 500;

// rico.log();

// console.log('rico.refund(2, 100)')
// rico.refund(2, 100);

// // rico.blockNumber = 1000;

// rico.log();


describe('Refundable ICO', function() {

    describe('Test 1', function() {

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

        var ethIctRatio = 1;

        var rico = new RICO(ethIctRatio);


        it('allocation phase', function() {


            rico.commit(accounts[0], 100);
            rico.commit(accounts[1], 100);
            rico.commit(accounts[2], 500);

            assert.isTrue(accounts[0].ETH === 0);
            assert.isTrue(accounts[1].ETH === 100);
            assert.isTrue(accounts[2].ETH === 500);
            assert.isTrue(accounts[0].ICT / ethIctRatio === 100);
            assert.isTrue(accounts[1].ICT / ethIctRatio === 100);
            assert.isTrue(accounts[2].ICT / ethIctRatio === 500);

            assert.isTrue((rico.investorETH + rico.projectETH - rico.projectETHWithdrawn) === rico.REALETH ,'Sanity check');

            rico.refund(accounts[1], 50 * ethIctRatio);
            rico.refund(accounts[2], 500 * ethIctRatio);
console.log(accounts[2])

            assert.isTrue(accounts[1].ICT / ethIctRatio === 50);
            assert.isTrue(accounts[1].ICTL === 0);
            assert.isTrue(accounts[1].ETH === 150);
            
            assert.isTrue(accounts[2].ICT === 0);
            assert.isTrue(accounts[2].ICTL === 0);
            assert.isTrue(accounts[2].ETH === 1000);

            assert.isTrue((rico.investorETH + rico.projectETH - rico.projectETHWithdrawn) === rico.REALETH ,'Sanity check');

            rico.commit(accounts[0], 100);
            rico.commit(accounts[1], 100);
            rico.commit(accounts[3], 5000);


        });
    });
});