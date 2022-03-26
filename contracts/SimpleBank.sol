// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract SimpleBank {
    uint8 private clientCount;
    mapping (address => uint) private balances;
    address public ownerini;
    address payable sender;
    uint256 articlePrice = 0.01 ether;
    mapping (uint => address) public balanceAdd;

  // Log the event about a deposit being made by an address and its amount
    event LogDepositMade(address indexed accountAddress, uint amount);
    
    constructor() public payable {
        /* Set the owner to the creator of this contract */
        ownerini = msg.sender;
        clientCount = 0;
        balances[msg.sender] = 0;
    }


    /// Deposit ether into bank, requires method is "payable"
    /// The balance of the user after the deposit is made
    function deposit() public payable returns (uint) {
        if (balances[msg.sender]==0){
        balanceAdd[clientCount] = msg.sender;
        clientCount++;
      }
        balances[msg.sender] += (msg.value);
        emit LogDepositMade(msg.sender, msg.value);
        return balances[msg.sender];
    }

    ///  Withdraw ether from bank
    /// The balance remaining for the user
    function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
        // Check enough balance available, otherwise just return balance
        sender = payable(msg.sender);
        if (withdrawAmount <= balances[sender]) {
            balances[sender] -= withdrawAmount;
            sender.transfer(withdrawAmount);
            
        }
        return balances[msg.sender];
    }

   
    function balance() public view returns (uint) {
        return balances[msg.sender];
    }

    ///  The balance of the Simple Bank contract
    function depositsBalance() public view returns (uint) {
        return address(this).balance;
    }

    function PayAuthor(address author) public returns (uint remainingBal){
            address viewer = msg.sender;
            if (articlePrice <= balances[viewer]) {
            balances[viewer] -= articlePrice;
            balances[author]  += articlePrice;        
        }
        return balances[msg.sender];
            

    }

    function getAll() public view returns (address[] memory){
    address[] memory ret = new address[](clientCount);
    for (uint i = 0; i < clientCount; i++) {
        ret[i] = balanceAdd[i];
    }
    return ret;
    }
    function getArticle() public view returns(uint256){
      return articlePrice;
    }

    function getOwner() public view returns(address){
        return ownerini;
    }

}