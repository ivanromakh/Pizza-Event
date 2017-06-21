import { Meteor } from 'meteor/meteor';

import { Groups } from '../api/groups/groups';
import { Events } from '../api/events/events';

import { sendEmailsToCoWorkers, sendEmailToGroupOwner } from './send_receipts.js';
import { getUserName, getUserEmail } from './users.js';

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
  return [...orders, ...user.orders];
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
      const count = discountItems.reduce((prev, dicItem) => prev + dicItem.count, 0);

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

const calcPrice = function calcPrice(itemsData, username, allPercents) {
  let orderPrice = 0;
  const items = itemsData.map((item) => {
    const itemData = { name: item.name, count: item.count };
    const percent = allPercents.find((perc) => perc.name === item.name);
    if (percent) {
      itemData.price = item.price * item.count * percent.percent;
    } else {
      itemData.price = item.price * item.count;
    }
    orderPrice += item.price;
    return itemData;
  });
  return { items, orderPrice, username };
};

const getOrdersData = function getOrdersData(event, percents) {
  let totalPrice = 0;
  const orders = event.users.reduce((result, user) => {
    const email = getUserEmail(user._id);
    const username = getUserName(user._id);
    const order = calcPrice(user.orders, username, percents);
    totalPrice += order.orderPrice;
    result.push({ order, email, username, userId: user._id });
    return result;
  }, []);
  return { orders, totalPrice };
};

const MakeAndSendEmails = function MakeAndSendEmails(event) {
  const group = Groups.findOne({ _id: event.groupId });

  const discounts = getItemsWithDiscount(group);
  const items = getEventOrders(event);
  const countedItems = itemsCountWithDiscount(items, discounts);
  const percents = findDicountPercents(countedItems);
  const { orders, totalPrice } = getOrdersData(event, percents);

  sendEmailsToCoWorkers(orders);
  sendEmailToGroupOwner(orders, totalPrice, group.owner);

  changeEventStatus(event._id);
};

// check if all users make orders
Meteor.methods({
  isAllMakeOrders(eventId) {
    const event = Events.findOne({ _id: eventId });

    let isOrdered = false;

    if (event && event.status === 'ordering' && event.users) {
      const notOrderedUser = event.users.find((user) => !user.confirm);
      isOrdered = !notOrderedUser;
    }
    if (isOrdered) {
      MakeAndSendEmails(event);
    }
    return isOrdered;
  },
});
