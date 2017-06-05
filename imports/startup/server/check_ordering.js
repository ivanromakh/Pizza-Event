import { Meteor } from 'meteor/meteor';

import { Groups } from '../../api/groups/groups';
import { Events } from '../../api/events/events';

import {sendEmailsToCoWorkers, sendEmailToGroupOwner} from './send_receipts.js';


function findItemsWithDiscount(disc, item) {
  if(item.coupons>0) {
    disc.push(item);
  }
  return disc;
}

function getItemsWithDiscount(group) {
  return group.menuItems.reduce(findItemsWithDiscount, []);
}

function uniteOrders(orders, user) {
  orders = orders.concat(user.orders);
  return orders;
}

function getEventOrders(event) {
  return event.users.reduce(uniteOrders, []);
}

function countOrders(orders) {
  for(var x = 0; x < orders.length-1; x++) {
    for(var y = x+1; y < orders.length; y++) {
      if(orders[x].name == orders[y].name) {
        var tempCount = parseInt(orders[x].count) + parseInt(orders[y].count);
        orders[x].count = tempCount;
        orders.splice(y, 1);
        y--;
      }
    }
  }
  return orders;
}

function findDicountPercents(discounts, countedOrders) {
  var percents = [];

  for(var x = 0; x < countedOrders.length; x++) {
    for(var y = 0; y < discounts.length; y++) {
      if(discounts[y].name == countedOrders[x].name) {
        var percent = 1 - parseInt(discounts[y].coupons)/parseInt(countedOrders[x].count);
        percents.push({name: countedOrders[x].name, percent: percent});
      }
    }
  }
  return percents;
}

function changeEventStatus(eventId) {
  Events.update({ _id: eventId },
    { $set: {'status': 'ordered' } });
}

function makeReceipts(event, group) {
  var discounts = getItemsWithDiscount(group);
  var orders = getEventOrders(event);
  var countedOrders = countOrders(orders);
  var percents = findDicountPercents(discounts, countedOrders); 
  
  sendEmailsToCoWorkers(event, percents);
  sendEmailToGroupOwner(event, percents, group.owner);

  changeEventStatus(event._id);
}

// check if all users make orders
Meteor.setInterval(function() {
  var events = Events.find().fetch();
  if(events) {
    events.forEach(function(event) {
      var group = Groups.findOne({ _id: event.groupId });
      
      if(event.status == 'ordering') {
        if(group && event.users) {
          var usersId = group.users.map((user)=> user._id);

          var eventUsersId = event.users.map(function(user) { 
            if(user.confirm) {
              return user._id;
            }
          });
  
          // check if all users in group make order
          var isNotOrdered = usersId.find(function(userId) {
            var isOrdered = this.eventUsersId.find(function(eventUserId) {
              if(eventUserId == this.userId) { return true; }
            }, { userId: userId });

            if(!isOrdered) {
              return true;
            }
          }, { eventUsersId: eventUsersId });

          var ordered = !isNotOrdered;

          (ordered) ? makeReceipts(event, group) : null;
        }
      }
    });
  }
}, 10000);