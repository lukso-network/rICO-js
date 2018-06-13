
function RICO(ratio){
    // constants
    this.ethIctRatio = ratio || 1;
    this.totalICT = 10000;
    this.totalETH = this.ethIctRatio * this.totalICT;
    this.totalBlocks = 1000; // duration in  blocks of the RICO

    this.blockNumber = 0; // since start of the RICO


    this.investorETH = 0;
    this.projectETH = 0;
    this.REALETH = 0;

    this.projectETHWithdrawn = 0;


    // flow control
    this.flow = 0;
    this.flowLastBlock = 0;
};

RICO.prototype.log = function() {

    // allocate funds to project before
    this._allocateFunds();


    console.log('--------');
    console.log('blockNumber: ', this.blockNumber);
    console.log('Current Flow: ', this.flow);
    console.log('investorETH: ', this.investorETH);
    console.log('projectETH: ', this.projectETH);
    console.log('available for project: ', this.projectETH - this.projectETHWithdrawn);
    console.log('ETH in RICO: ', this.REALETH);
    // console.log('ETH in Project: ', project.ETH);
    console.log('Adds up: ', (this.investorETH + this.projectETH - this.projectETHWithdrawn) === this.REALETH);
    console.log('--------');
}


RICO.prototype._allocateFunds = function() {

    // recalculate the flow
    this.flow = this.investorETH / (this.totalBlocks - this.flowLastBlock);


    var blockPassed = this.blockNumber - this.flowLastBlock;
    var transferETH = blockPassed * this.flow;

    this.investorETH -= transferETH;
    this.projectETH += transferETH;

    // set the last flow block number
    this.flowLastBlock = this.blockNumber;
};


// INVESTOR COMMITS FUNDS
RICO.prototype.commit = function(account, eth) {

    // allocate funds to project before
    this._allocateFunds();

    // CHECK that his account has the balance
    if (account.ETH < eth) return;

    // committing is only possible, if given ETH is below cap - ETH in pot
    if ((this.totalETH - this.REALETH) >= eth) {

        // update accounts balance
        account.ETH -= eth;
        account.ICT += eth * this.ethIctRatio;

        // update internal balances
        this.REALETH += eth;
        this.investorETH += eth;
    }

    this.log();
};


// INVESTOR REFUNDS
RICO.prototype.refund = function(account, ict) {
    
    // allocate funds to project before
    this._allocateFunds();

    // CHECK that his account has the balance
    if (account.ICT < ict) return;


    // calculate the current ratio
    var ratio = 1 - this.blockNumber / this.totalBlocks;
    console.log('ratio', ratio);

    // calc the ETH refund amount
    var eth = ict / this.ethIctRatio * ratio;

    // update accounts balance
    account.ICT -= ict;
    account.ICTL += ict * (1 - ratio);
    account.ETH += eth;


    // update internal balances
    this.investorETH -= eth;
    this.REALETH -= eth;

    this.log();
}


// PROJECT WITHDRAWS ALLOCATED FUNDS
RICO.prototype.projectWithdraw = function(project, eth) {

    // allocate funds to project before
    this._allocateFunds();


    if ((this.projectETH - this.projectETHWithdrawn) >= eth && eth > 0) {

        // update project balance
        project.ETH += eth;


        // update internal balances
        this.projectETHWithdrawn += eth;
        this.REALETH -= eth;

    }

    this.log();
};

if (typeof window === 'undefined')
    module.exports = RICO;