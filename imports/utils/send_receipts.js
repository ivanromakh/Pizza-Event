import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { SSR } from 'meteor/meteorhacks:ssr';

SSR.compileTemplate('emailToCoWorker', Assets.getText('emailToCoWorker.html'));
SSR.compileTemplate('emailToGroupOwner', Assets.getText('emailToGroupOwner.html'));

const getEmailByUserId = function getEmailByUserId(userId) {
  const user = Meteor.users.findOne({ _id: userId });
  const email = user.profile
    ? user.services.google.email
    : user.emails[0].address;
  return email;
};

const sendGroupOwnerEmail = function sendGroupOwnerEmail(email, emailData) {
  console.log(emailData);
  console.log(SSR.render('emailToGroupOwner', emailData));
  /*Email.send({
    to: email,
    from: 'ivanrouman@gmail.com',
    subject: 'Pizza Ordering',
    html: SSR.render('emailToGroupOwner', { emailData }),
  });*/
};

const sendCoWorkerEmail = function sendCoWorkerEmail(emailData) {
  console.log(emailData);
  console.log(SSR.render('emailToCoWorker', emailData));
  /*Email.send({
    to: emailData.email,
    from: 'ivanrouman@gmail.com',
    subject: 'Pizza Ordering',
    html: SSR.render('emailToCoWorker', { emailData }),
  });*/
};

exports.sendEmailsToCoWorkers = function sendEmailsToCoWorkers(orders) {
  orders.forEach(sendCoWorkerEmail);
};

exports.sendEmailToGroupOwner = function sendEmailToGroupOwner(orders, totalPrice, groupOwnerId) {
  const email = getEmailByUserId(groupOwnerId);
  sendGroupOwnerEmail(email, { orders, totalPrice });
};
