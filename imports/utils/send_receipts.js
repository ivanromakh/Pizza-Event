import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import fillReceipt from './fill_receipts';

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

const sendEmail = function sendEmail(email, receipt) {
  Email.send({
    to: email,
    from: 'ivanrouman@gmail.com',
    subject: 'Pizza Ordering',
    html: receipt,
  });
};

const sendEmailCoWorker = function sendEmailCoWorker(user) {
  const email = getEmailByUserId(user._id);
  const username = getUserNameByUserId(user._id);
  const { receipt } = fillReceipt(user.orders, username, this.percents);

  sendEmail(email, receipt);
};

exports.sendEmailsToCoWorkers = function sendEmailsToCoWorkers(event, percents) {
  event.users.forEach(sendEmailCoWorker, { percents });
};

exports.sendEmailToGroupOwner = function sendEmailToGroupOwner(event, percents, groupOwnerId) {
  const email = getEmailByUserId(groupOwnerId);
  let totalPrice = 0;
  let totalReceipt = '<h>Hello Group made this is all orders from your group</h1>';

  for (let x = 0; x < event.users.length; x++) {
    const orders = event.users[x].orders;
    const username = getUserNameByUserId(event.users[x]._id);

    const { receipt, orderPrice } = fillReceipt(orders, username, percents);
    totalPrice += orderPrice;
    totalReceipt += receipt;
  }
  totalReceipt += `<table style="background-color: #7ef07a; border-style: solid; border-radius: 10px; margin: 10px; padding:10px"><tr><td><p style="margin:0">Total price: ${totalPrice.toFixed(2)}</p></td></tr></table>`;
  sendEmail(email, totalReceipt);
};
