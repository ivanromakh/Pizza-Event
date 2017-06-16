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
  return [...orders, ...user.orders];
};

const getEventOrders = function getEventOrders(event) {
  return event.users.reduce(uniteOrders, []);
};

const getEmailByUserId = function getEmailByUserId(userId) {
  const user = Meteor.users.findOne({ _id: userId });
  const email = user.profile
    ? user.services.google.email
    : user.emails[0].address;
  return email;
};

const getUserNameByUserId = function getUserNameByUserId(userId) {
  const user = Meteor.users.findOne({ _id: userId });
  const username = user.profile
    ? user.profile.name
    : user.username;
  return username;
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
    let itemData = { name: item.name, count: item.count };
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
    const email = getEmailByUserId(user._id);
    const username = getUserNameByUserId(user._id);
    const order = calcPrice(user.orders, username, percents);
    totalPrice += order.orderPrice;
    result.push({ order, email, username, userId: user._id });
    return result;
  }, []);
  return { orders, totalPrice };
};

const makeReceipts = function makeReceipts(event, group) {
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
            const isOrdered = eventUsersId.find((eventUserId) => {
              if (eventUserId === userId) {
                return true;
              }
              return false;
            });

            if (!isOrdered) {
              return true;
            }
            return false;
          });

          const ordered = !isNotOrdered;

          if (ordered) {
            makeReceipts(event, group);
          }
        }
      }
    });
  }
}, 10000);
