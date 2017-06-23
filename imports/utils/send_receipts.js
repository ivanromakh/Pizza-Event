import { Email } from 'meteor/email';
import { SSR } from 'meteor/meteorhacks:ssr';

import { getUserEmail } from './users.js';

SSR.compileTemplate('emailToCoWorker', Assets.getText('emailToCoWorker.html'));
SSR.compileTemplate('emailToGroupOwner', Assets.getText('emailToGroupOwner.html'));

const sendGroupOwnerEmail = function sendGroupOwnerEmail(email, emailData) {
  console.log(emailData);
  console.log(SSR.render('emailToGroupOwner', emailData));
   Email.send({
    to: email,
    from: 'ivanrouman@gmail.com',
    subject: 'Pizza Ordering',
    html: SSR.render('emailToGroupOwner', emailData),
  });
};

const sendCoWorkerEmail = function sendCoWorkerEmail(emailData) {
  console.log(emailData);
  console.log(SSR.render('emailToCoWorker', emailData));
   Email.send({
    to: emailData.email,
    from: 'ivanrouman@gmail.com',
    subject: 'Pizza Ordering',
    html: SSR.render('emailToCoWorker', emailData),
  });
};

exports.sendEmailsToCoWorkers = function sendEmailsToCoWorkers(orders) {
  orders.forEach(sendCoWorkerEmail);
};

exports.sendEmailToGroupOwner = function sendEmailToGroupOwner(orders, totalPrice, groupOwnerId) {
  const email = getUserEmail(groupOwnerId);
  sendGroupOwnerEmail(email, { orders, totalPrice });
};
