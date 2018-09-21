var chai = require('chai');
var RICO = require('./refundable2.js');
var assert = chai.assert;



sanityCheck = function(rico){
    assert.equal((rico.investorETH + rico.projectETH - rico.projectETHWithdrawn), rico.REALETH ,'Sanity check, ETH doesn\'t add up!');
}

// rico.commit(1, 130);
// rico.commit(2, 180);

// rico.blockNumber = 500;

// rico.log();

// console.log('rico.refund(2, 100)')
// rico.refund(2, 100);

// // rico.blockNumber = 1000;

// rico.log();


var ethIctRatio = 1;



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


        var rico = new RICO(ethIctRatio);

        describe('allocation phase', function() {
            it('commit and refund', function() {


                rico.commit(accounts[0], 100);
                rico.commit(accounts[1], 100);
                rico.commit(accounts[2], 500);

                assert.equal(accounts[0].ETH, 0);
                assert.equal(accounts[1].ETH, 100);
                assert.equal(accounts[2].ETH, 500);
                assert.equal(accounts[0].ICT / ethIctRatio, 100);
                assert.equal(accounts[1].ICT / ethIctRatio, 100);
                assert.equal(accounts[2].ICT / ethIctRatio, 500);

                sanityCheck(rico);

                rico.refund(accounts[1], 50 * ethIctRatio);
                rico.refund(accounts[2], 500 * ethIctRatio);

                assert.equal(accounts[1].ICT / ethIctRatio, 50);
                assert.equal(accounts[1].ICTL, 0);
                assert.equal(accounts[1].ETH, 150);
                
                assert.equal(accounts[2].ICT, 0);
                assert.equal(accounts[2].ICTL, 0);
                assert.equal(accounts[2].ETH, 1000);

                sanityCheck(rico);

                rico.commit(accounts[1], 100);
                rico.commit(accounts[2], 100);
                rico.commit(accounts[3], 5000);

                rico.refund(accounts[3], 50 * ethIctRatio);


                assert.equal(accounts[1].ETH, 50);
                assert.equal(accounts[2].ETH, 900);
                assert.equal(accounts[3].ETH, 3050);
                assert.equal(accounts[1].ICT / ethIctRatio, 150);
                assert.equal(accounts[2].ICT / ethIctRatio, 100);
                assert.equal(accounts[3].ICT / ethIctRatio, 4950);
                assert.equal(accounts[1].ICTL, 0);
                assert.equal(accounts[2].ICTL, 0);
                assert.equal(accounts[3].ICTL, 0);


                sanityCheck(rico);

            });
        });

        describe('distribution phase', function() {

            it('check at 25%', function() {
                var ratio = 0;

                // time passed 25%
                rico.blockNumber = rico.totalBlocks / 4;
                var ratio = rico.blockNumber / rico.totalBlocks;

                rico.log();

                assert.equal(rico.flow, 5.3);
                assert.equal(rico.investorETH, 5300 * (1 - ratio));
                assert.equal(rico.projectETH, 5300 * ratio);
                assert.equal(rico.REALETH, 5300);

                sanityCheck(rico);


            });

            it('check at 50%', function() {

                // time passed 50%
                rico.blockNumber = rico.totalBlocks / 2;

                var ratio = rico.blockNumber / rico.totalBlocks;

                rico.log();


                assert.equal(rico.flow, 5.3);
                assert.equal(rico.investorETH, 5300 * (1 - ratio));
                assert.equal(rico.projectETH, 5300 * ratio);
                assert.equal(rico.REALETH, 5300);

                sanityCheck(rico);

            });

            it('check at 75%', function() {

                // time passed 75%
                rico.blockNumber = rico.totalBlocks / 4 * 3;
                var ratio = rico.blockNumber / rico.totalBlocks;

                rico.log();

                assert.equal(rico.flow, 5.3);
                assert.equal(rico.investorETH, 5300 * (1 - ratio));
                assert.equal(rico.projectETH, 5300 * ratio);
                assert.equal(rico.REALETH, 5300);

                sanityCheck(rico);

            });

            it('check at 100%', function() {

                // time passed 75%
                rico.blockNumber = rico.totalBlocks;
                var ratio = 1;

                rico.log();

                assert.equal(rico.flow, 5.3);
                assert.equal(rico.investorETH, 5300 * (1 - ratio));
                assert.equal(rico.projectETH, 5300 * ratio);
                assert.equal(rico.REALETH, 5300);

                sanityCheck(rico);

            });
        });
    });

    describe('Test 2', function() {

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
            ETH: 2000,
            ICT: 0,
            ICTL: 0
        },{
            ETH: 8000,
            ICT: 0,
            ICTL: 0
        }];


        var rico = new RICO(ethIctRatio);

        describe('allocation phase', function() {

            it('commit', function() {
                rico.commit(accounts[0], 100);
                rico.commit(accounts[1], 100);
                rico.commit(accounts[2], 2000);
                rico.commit(accounts[3], 7800);

                assert.equal(accounts[0].ETH, 0);
                assert.equal(accounts[1].ETH, 100);
                assert.equal(accounts[2].ETH, 0);
                assert.equal(accounts[3].ETH, 200);
                assert.equal(accounts[0].ICT / ethIctRatio, 100);
                assert.equal(accounts[1].ICT / ethIctRatio, 100);
                assert.equal(accounts[2].ICT / ethIctRatio, 2000);
                assert.equal(accounts[3].ICT / ethIctRatio, 7800);

                sanityCheck(rico);
            });
        });

        describe('distribution phase', function() {

            it('time passes', function() {

                // time passed
                rico.blockNumber = 250;

                var ratio = rico.blockNumber / rico.totalBlocks;

                rico.log();

                assert.equal(rico.flow, 10);
                assert.equal(rico.investorETH, 10000 * (1 - ratio));
                assert.equal(rico.projectETH, 10000 * ratio);
                assert.equal(rico.REALETH, 10000);

                sanityCheck(rico);

            });

            it('refund', function() {

                // time didnt passed
                rico.blockNumber = 250;

                var ratio = rico.blockNumber / rico.totalBlocks;


                rico.refund(accounts[3], 100 * ethIctRatio);


                assert.equal(rico.flow, 9.9);
                assert.equal(rico.investorETH, 10000 * (1 - ratio) - 100 * (1 - ratio));
                assert.equal(rico.projectETH, 10000 * ratio);
                assert.equal(rico.REALETH, 10000 - 100 * (1 - ratio));

                assert.equal(accounts[3].ETH, 200 + 100 * (1 - ratio));

                sanityCheck(rico);

            });


            it('mid-term immediate loss', function() {

                // time didnt passed
                rico.blockNumber = 300;

                var ratio = rico.blockNumber / rico.totalBlocks;


                assert.equal(accounts[1].ETH, 100);
                assert.equal(accounts[1].ICT, 100);

                rico.commit(accounts[1], 50);

                assert.equal(accounts[1].ETH, 50);
                assert.equal(accounts[1].ICT, 150);


                rico.refund(accounts[1], 50 * ethIctRatio);

                assert.equal(accounts[1].ETH, 50 + 50 * (1 - ratio)); // 70% back of 50
                assert.equal(accounts[1].ICT, 100);
                assert.equal(accounts[1].ICTL, 50 * ethIctRatio * ratio); // keeps 30% of 50 *

                sanityCheck(rico);

            });

            it('check at 50%', function() {

                // time didnt passed
                rico.blockNumber = 500;

                var ratio = rico.blockNumber / rico.totalBlocks;

                // refund all tokens
                rico.refund(accounts[2], accounts[2].ICT);

                assert.equal(accounts[2].ICTL, 2000 * ethIctRatio / 2);
                assert.equal(accounts[2].ETH, 2000 * ethIctRatio / 2);

                sanityCheck(rico);

            });


            it('over', function() {

                // time didnt passed
                rico.blockNumber = 1000;

                rico.log();

                assert.equal(rico.flow, 7.922);
                assert.equal(rico.investorETH, 0);
                assert.equal(rico.projectETH, 8940);
                assert.equal(rico.REALETH, 8940);

                sanityCheck(rico);

            });
        });
    });
});