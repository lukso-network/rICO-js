    var chai = require('chai');
var RICO = require('./refundable2.js');
var assert = chai.assert;



sanityCheck = function(rico){
    assert.equal((rico.investorETH + rico.projectETH - rico.projectETHWithdrawn), rico.REALETH ,'Sanity check, ETH doesn\'t add up!');
}

sanityCheckAccounts = function(accounts){

    accounts.forEach(function(account){
        if(typeof account.shouldBe.ETH !== 'undefined') {
            assert.equal(account.ETH, account.shouldBe.ETH, 'ETH should be');
        }
        if(typeof account.shouldBe.LIA !== 'undefined') {
            assert.equal(account.LIA, account.shouldBe.LIA, 'LIA should be');
        }
        if(typeof account.shouldBe.LIAL !== 'undefined') {
            assert.equal(account.LIAL, account.shouldBe.LIAL, 'LIAL should be');
        }
    });
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
            LIA: 0,
            LIAL: 0
        },{
            ETH: 200,
            LIA: 0,
            LIAL: 0
        },{
            ETH: 1000,
            LIA: 0,
            LIAL: 0
        },{
            ETH: 8000,
            LIA: 0,
            LIAL: 0
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
                assert.equal(accounts[0].LIA / ethIctRatio, 100);
                assert.equal(accounts[1].LIA / ethIctRatio, 100);
                assert.equal(accounts[2].LIA / ethIctRatio, 500);

                sanityCheck(rico);

                rico.refund(accounts[1], 50 * ethIctRatio);
                rico.refund(accounts[2], 500 * ethIctRatio);

                assert.equal(accounts[1].LIA / ethIctRatio, 50);
                assert.equal(accounts[1].LIAL, 0);
                assert.equal(accounts[1].ETH, 150);

                assert.equal(accounts[2].LIA, 0);
                assert.equal(accounts[2].LIAL, 0);
                assert.equal(accounts[2].ETH, 1000);

                sanityCheck(rico);

                rico.commit(accounts[1], 100);
                rico.commit(accounts[2], 100);
                rico.commit(accounts[3], 5000);

                rico.refund(accounts[3], 50 * ethIctRatio);


                assert.equal(accounts[1].ETH, 50);
                assert.equal(accounts[2].ETH, 900);
                assert.equal(accounts[3].ETH, 3050);
                assert.equal(accounts[1].LIA / ethIctRatio, 150);
                assert.equal(accounts[2].LIA / ethIctRatio, 100);
                assert.equal(accounts[3].LIA / ethIctRatio, 4950);
                assert.equal(accounts[1].LIAL, 0);
                assert.equal(accounts[2].LIAL, 0);
                assert.equal(accounts[3].LIAL, 0);


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
            LIA: 0,
            LIAL: 0
        },{
            ETH: 200,
            LIA: 0,
            LIAL: 0
        },{
            ETH: 2000,
            LIA: 0,
            LIAL: 0
        },{
            ETH: 8000,
            LIA: 0,
            LIAL: 0
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
                assert.equal(accounts[0].LIA / ethIctRatio, 100);
                assert.equal(accounts[1].LIA / ethIctRatio, 100);
                assert.equal(accounts[2].LIA / ethIctRatio, 2000);
                assert.equal(accounts[3].LIA / ethIctRatio, 7800);

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
                assert.equal(accounts[1].LIA, 100);

                rico.commit(accounts[1], 50);

                assert.equal(accounts[1].ETH, 50);
                assert.equal(accounts[1].LIA, 150);


                rico.refund(accounts[1], 50 * ethIctRatio);

                assert.equal(accounts[1].ETH, 50 + 50 * (1 - ratio)); // 70% back of 50
                assert.equal(accounts[1].LIA, 100);
                assert.equal(accounts[1].LIAL, 50 * ethIctRatio * ratio); // keeps 30% of 50 *

                sanityCheck(rico);

            });

            it('check at 50%', function() {

                // time didnt passed
                rico.blockNumber = 500;

                var ratio = rico.blockNumber / rico.totalBlocks;

                // refund all tokens
                rico.refund(accounts[2], accounts[2].LIA);

                assert.equal(accounts[2].LIAL, 2000 * ethIctRatio / 2);
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

    describe('Test 3', function() {

        var project = {
            ETH: 0
        };

        var accounts = [{
            ETH: 100,
            LIA: 0,
            LIAL: 0,
            COMMITS: 0,
            RETURNS: 0,
            shouldBe: {}
        },{
            ETH: 200,
            LIA: 0,
            LIAL: 0,
            COMMITS: 0,
            RETURNS: 0,
            shouldBe: {}
        },{
            ETH: 2000,
            LIA: 0,
            LIAL: 0,
            COMMITS: 0,
            RETURNS: 0,
            shouldBe: {}
        },{
            ETH: 8000,
            LIA: 0,
            LIAL: 0,
            COMMITS: 0,
            RETURNS: 0,
            shouldBe: {}
        }];


        var rico = new RICO(ethIctRatio);

        describe('allocation phase', function() {

            it('commit', function() {

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[0].shouldBe.ETH = accounts[0].ETH - 100;
                accounts[1].shouldBe.ETH = accounts[1].ETH - 100;
                accounts[2].shouldBe.ETH = accounts[2].ETH - 2000;
                accounts[3].shouldBe.ETH = accounts[3].ETH - 7800;
                accounts[0].shouldBe.LIA = accounts[0].LIA + 100;
                accounts[1].shouldBe.LIA = accounts[1].LIA + 100;
                accounts[2].shouldBe.LIA = accounts[2].LIA + 2000;
                accounts[3].shouldBe.LIA = accounts[3].LIA + 7800;

                // COMMIT
                rico.commit(accounts[0], 100);
                rico.commit(accounts[1], 100);
                rico.commit(accounts[2], 2000);
                rico.commit(accounts[3], 7800);

                accounts[0].COMMITS += 100;
                accounts[1].COMMITS += 100;
                accounts[2].COMMITS += 2000;
                accounts[3].COMMITS += 7800;

                sanityCheckAccounts(accounts);
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

                accounts[3].shouldBe.ETH = accounts[3].ETH + 100 * ethIctRatio * (1 - ratio);
                accounts[3].shouldBe.LIA = accounts[3].LIA - 100;

                // REFUND
                rico.refund(accounts[3], 100 * ethIctRatio);

                accounts[3].RETURNS += 100;


                assert.equal(rico.flow, 9.9);
                assert.equal(rico.investorETH, 10000 * (1 - ratio) - 100 * (1 - ratio));
                assert.equal(rico.projectETH, 10000 * ratio);
                assert.equal(rico.REALETH, 10000 - 100 * (1 - ratio));


                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });


            it('mid-term immediate loss', function() {

                // time passed
                rico.blockNumber = 300;

                var ratio = rico.blockNumber / rico.totalBlocks;

                assert.equal(accounts[1].ETH, 100);
                assert.equal(accounts[1].LIA, 100);
                assert.equal(accounts[1].LIAL, 0);

                accounts[1].shouldBe.ETH = accounts[1].ETH - 50;
                accounts[1].shouldBe.LIA = accounts[1].LIA + 50 / ethIctRatio;

                // COMMIT
                rico.commit(accounts[1], 50);

                accounts[1].COMMITS += 50;

                sanityCheckAccounts(accounts);

                assert.equal(accounts[1].ETH, 50);
                assert.equal(accounts[1].LIA, 150);

                accounts[1].shouldBe.ETH = accounts[1].ETH + 50 * ethIctRatio * (1 - ratio);
                accounts[1].shouldBe.LIA = accounts[1].LIA - 50 / ethIctRatio;

                // REFUND
                rico.refund(accounts[1], 50 * ethIctRatio);

                accounts[1].RETURNS += 50;

                assert.equal(accounts[1].ETH, 50 + 50 * (1 - ratio)); // 70% back of 50
                assert.equal(accounts[1].LIA, 100);
                assert.equal(accounts[1].LIAL, 50 * ethIctRatio * ratio); // keeps 30% of 50 *

                sanityCheckAccounts(accounts);

                accounts[3].shouldBe.ETH = accounts[3].ETH + Math.floor(2000 * ethIctRatio * (1 - ratio));
                accounts[3].shouldBe.LIA = accounts[3].LIA - 2000 / ethIctRatio;

                // REFUND
                rico.refund(accounts[3], 2000 * ethIctRatio);

                accounts[3].RETURNS += 2000;

                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 50%', function() {

                // time passed
                rico.blockNumber = 500;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[2].shouldBe.ETH = accounts[2].ETH + accounts[2].LIA * ethIctRatio * (1 - ratio);
                accounts[2].shouldBe.LIA = accounts[2].LIA - accounts[2].LIA / ethIctRatio;

                // REFUND all tokens
                accounts[2].RETURNS += accounts[2].LIA;
                rico.refund(accounts[2], accounts[2].LIA);


                assert.equal(accounts[2].LIAL, 2000 * ethIctRatio / 2);
                assert.equal(accounts[2].ETH, 2000 * ethIctRatio / 2);

                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 75%', function() {

                // time passed
                rico.blockNumber = 750;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[3].shouldBe.ETH = accounts[3].ETH - 275;
                accounts[3].shouldBe.LIA = accounts[3].LIA + 275 / ethIctRatio;

                // COMMIT
                rico.commit(accounts[3], 275);

                accounts[3].COMMITS += 275;

                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 78%', function() {

                // time passed
                rico.blockNumber = 780;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[3].shouldBe.ETH = accounts[3].ETH + Math.floor(20 * ethIctRatio * (1 - ratio));
                accounts[3].shouldBe.LIA = accounts[3].LIA - 20 / ethIctRatio;

                // REFUND
                rico.refund(accounts[3], 20 * ethIctRatio);

                accounts[3].RETURNS += 20;


                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 78%', function() {

                // time passed
                rico.blockNumber = 780;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[3].shouldBe.ETH = accounts[3].ETH + Math.floor(20 * ethIctRatio * (1 - ratio));
                accounts[3].shouldBe.LIA = accounts[3].LIA - 20 / ethIctRatio;

                // REFUND
                rico.refund(accounts[3], 20 * ethIctRatio);

                accounts[3].RETURNS += 20;


                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 79%', function() {

                // time passed
                rico.blockNumber = 790;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[3].shouldBe.ETH = accounts[3].ETH + Math.floor(45 * ethIctRatio * (1 - ratio));
                accounts[3].shouldBe.LIA = accounts[3].LIA - 45 / ethIctRatio;

                // REFUND
                rico.refund(accounts[3], 45 * ethIctRatio);

                accounts[3].RETURNS += 45;


                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 81%', function() {

                // time passed
                rico.blockNumber = 810;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[3].shouldBe.ETH = accounts[3].ETH + Math.floor(52 * ethIctRatio * (1 - ratio));
                accounts[3].shouldBe.LIA = accounts[3].LIA - 52 / ethIctRatio;

                // REFUND
                rico.refund(accounts[3], 52 * ethIctRatio);

                accounts[3].RETURNS += 52;


                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });

            it('check at 81%', function() {

                // time passed
                rico.blockNumber = 810;

                var ratio = rico.blockNumber / rico.totalBlocks;

                accounts[3].shouldBe.ETH = accounts[3].ETH - 1000;
                accounts[3].shouldBe.LIA = accounts[3].LIA + 1000 / ethIctRatio;

                // COMMIT
                rico.commit(accounts[3], 1000);

                accounts[3].COMMITS += 1000;


                sanityCheckAccounts(accounts);
                sanityCheck(rico);

            });


            it('over', function() {

                // time didnt passed
                rico.blockNumber = 1000;

                rico.log();

                // assert.equal(accounts[1].LIAL, accounts[1].LIA - accounts[1].RETURNS  + accounts[1].LIA);
                // assert.equal(accounts[2].LIAL, accounts[2].LIA - accounts[2].RETURNS);
                // assert.equal(accounts[3].LIAL, accounts[3].LIA - accounts[3].RETURNS);

                console.log(accounts);

                assert.equal(rico.investorETH, 0);
                assert.equal(rico.projectETH, 8789);
                assert.equal(rico.REALETH, 8789);
                assert.equal(rico.flow, 12.16842105263158);

                sanityCheck(rico);

            });
        });
    });
});