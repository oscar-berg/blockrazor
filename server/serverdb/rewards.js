//import { Mongo } from 'meteor/mongo';
//export var Rewards = new Mongo.Collection('rewards');
import { UserData } from './UserData.js';
import { Wallet } from '../../lib/database/Wallet.js';

var rewards = {
  planned: 1,
  active: 1.8
};

export var getRewardTypeOf = function(item, context) {
  if(context == "currency") {
    if(_.findWhere(item, {'tag':'proposal'})) {
      return "planned";
    } else {return "active"}
  }
};


var getRewardFor = function(itemType, creationTime) {
  if (creationTime === false) {
    return rewards[itemType];
  }
};

export var creditUserWith = function(amount, userId, reason) {
  if(Meteor.isServer) {
    UserData.upsert({_id: userId}, {$inc: {balance: amount}});
    Wallet.insert({
      time: new Date().getTime(),
      owner: userId,
      type: "transaction",
      from: "Blockrazor",
      message: "Congratulations! You've been awarded " + amount + " KZR for " + reason,
      amount: amount
    });
    return true;
  }
};

export var rewardCurrencyCreator = function(launchTags, owner, currencyName) {
  console.log("start to credit");
  console.log(owner);
  var rewardType = getRewardTypeOf(launchTags, "currency");
  console.log(rewardType);
  var rewardAmount = parseFloat(getRewardFor(rewardType, false));
  console.log(rewardAmount);
  var reason = "submitting " + currencyName.toString();
  console.log(reason);
  creditUserWith(rewardAmount, owner, reason);
  return true;

};

Meteor.methods({

  // getBalance: function() {
  //   return UserData.findOne({_id: Meteor.user()._id}).balance;
  // },

});
