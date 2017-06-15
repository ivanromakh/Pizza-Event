import { Meteor } from 'meteor/meteor';

import { Groups } from '../api/groups/groups';
import { Events } from '../api/events/events';

import { sendEmailsToCoWorkers, sendEmailToGroupOwner } from './send_receipts.js';


const findItemsWithDiscount = function findItemsWithDiscount(disc, item) {
  if (item.coupons > 0) {
    disc.push(item);
  }
  return disc;
};

const getItemsWithDiscount = function getItemsWithDiscount(group) {
  return group.menuItems.reduce(findItemsWithDiscount, []);
};

const uniteOrders = function uniteOrders(orders, user) {
  return orders.concat(user.orders);
};

const getEventOrders = function getEventOrders(event) {
  return event.users.reduce(uniteOrders, []);
};

const itemsCountWithDiscount = function itemsCountWithDiscount(items, discounts) {
  let countedItems = null;

  if (discounts) {
    countedItems = discounts.map((discount) => {
      const item = {};

      const discountItems = items.filter((dicItem) => dicItem.name === discount.name);
      const count = discountItems.reduce((prev, dicItem) =>
        prev + dicItem.count
      , 0);

      item.name = discount.name;
      item.count = count;
      item.coupons = discount.coupons;

      return item;
    });
  }
  return countedItems;
};

const findDicountPercents = function findDicountPercents(countedItems) {
  const percents = countedItems.map((item) => {
    const percent = {};
    percent.name = item.name;
    percent.percent = 1 - item.coupons / item.count;
    return percent;
  });
  return percents;
};

const changeEventStatus = function changeEventStatus(eventId) {
  Events.update({ _id: eventId },
    { $set: { status: 'ordered' } });
};

const makeReceipts = function makeReceipts(event, group) {
  const discounts = getItemsWithDiscount(group);
  const items = getEventOrders(event);
  const countedItems = itemsCountWithDiscount(items, discounts);
  const percents = findDicountPercents(countedItems);

  sendEmailsToCoWorkers(event, percents);
  sendEmailToGroupOwner(event, percents, group.owner);

  changeEventStatus(event._id);
};

// check if all users make orders
Meteor.setInterval(() => {
  const events = Events.find().fetch();
  if (events) {
    events.forEach((event) => {
      const group = Groups.findOne({ _id: event.groupId });

      if (event.status === 'ordering') {
        if (group && event.users) {
          const usersId = group.users.map((user) => user._id);

          const eventUsersId = event.users.map((user) => {
            if (!user.confirm) {
              return null;
            }
            return user._id;
          });

          // check if all users in group make order
          const isNotOrdered = usersId.find((userId) => {
            const isOrdered = this.eventUsersId.find((eventUserId) => {
              if (eventUserId === this.userId) {
                return true;
              }
              return false;
            }, { userId });

            if (!isOrdered) {
              return true;
            }
            return false;
          }, { eventUsersId });

          const ordered = !isNotOrdered;

          if (ordered) {
            makeReceipts(event, group);
          }
        }
      }
    });
  }
}, 10000);
