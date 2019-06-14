

function RICO(){
    this.currentBlock = 0;
    this.totalBlocks = 1000;
    this.ethRatio = 1;
    this.totalLIA = 20000000;
    this.accounts = {};
    this.project = {
        ETH: 0
    };

    this.projectETH = 0;
    this.investorETH = 0;
    this.ETH = 0;

    this.alreadyAccountedRatio = 0;
};

RICO.prototype.setCurrentBlock = function(blockNumber) {
    this.currentBlock = blockNumber;

    this._calcProjectETH();
};

RICO.prototype.drain = function(eth) {
    this.ETH -= eth;

    this._calcProjectETH();
}

RICO.prototype._calcTimeRatio = function() {
    return this.currentBlock / this.totalBlocks;
};

RICO.prototype._calcProjectETH = function() {
    var currentTimeRatio = this._calcTimeRatio();

    // if (this.alreadyAccountedRatio !== currentTimeRatio) {

        // update balance
        this.projectETH += this.ETH * (currentTimeRatio - this.alreadyAccountedRatio);
        // this.projectETH = this.investorETH * currentTimeRatio;
        this.investorETH = this.ETH - this.projectETH;
        this.alreadyAccountedRatio = currentTimeRatio;
    // }


    // log
    console.log('-------');
    console.log('Project ETH', this.projectETH);
    console.log('Investor ETH ', this.investorETH);

    console.log('Adds up? ', (this.investorETH + this.projectETH) === this.ETH);
    console.log('-------');

};


// INVESTOR COMMITS FUNDS
RICO.prototype.commit = function(account, eth) {


    if (this.totalLIA - (eth * this.ethRatio) > 0) {

        this.accounts[account] = {
            LIA: eth * this.ethRatio,
            lockedLIA: 0,
            committedETH: eth,
        };

        // update balances
        this.totalLIA -= this.accounts[account].LIA;
        this.ETH += eth;

        // TODO: split here already by the current ratio to project and investor???
        this.investorETH += eth;

        // log
        console.log('Account '+account+' LIA ', this.accounts[account].LIA);
        console.log('total LIA available', this.totalLIA);
    }

    // update project eth balance
    this._calcProjectETH();
};


// INVESTOR REFUNDS
RICO.prototype.refund = function(account, sentIct) {
    
    // update project eth balance
    this._calcProjectETH();

    if (this.accounts[account].LIA >= ict) {

        

    }
}


// PROJECT WITHDRAWS ALLOCATED FUNDS
RICO.prototype.projectWithdraw = function(eth) {

    // update project eth balance
    this._calcProjectETH();


    if (this.projectETH >= eth && eth > 0) {

        // Update balance
        this.ETH -= eth;
        this.projectETH -= eth;

        // log
        console.log('Withdrawn to project ', eth);
    }

    // update project eth balance
    this._calcProjectETH();
};



var rico = new RICO();


rico.commit(1, 130);
rico.commit(2, 180);

rico.projectWithdraw(0);








