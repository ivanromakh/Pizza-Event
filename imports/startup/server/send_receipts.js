import fillReceipt from './fill_receipts';

function getEmailByUserId(userId) {
  var user = Meteor.users.findOne({ _id: userId });
  var email = user.profile 
    ? user.services.google.email 
    : user.emails[0].address;
  return email;
}

function getUserNameByUserId(userId) {
  var user = Meteor.users.findOne({ _id: userId });
  var username = user.profile 
    ? user.profile.name
    : user.username;
  return username;
}

function sendEmail(email, receipt) {
  Email.send({
    to: email,
    from: "ivanrouman@gmail.com",
    subject: "Pizza Ordering",
    html: receipt,
  });
}

function sendEmailCoWorker(user) {
  var email = getEmailByUserId(user._id);
  var username = getUserNameByUserId(user._id);

  var receipt = "<h> Your orders is: </h>";
  var orders = user.orders;

  var { receipt } = fillReceipt(user.orders, username, this.percents);
  
  sendEmail(email, receipt);
}

exports.sendEmailsToCoWorkers = function(event, percents) {
  event.users.forEach(sendEmailCoWorker, {percents: percents });
}

exports.sendEmailToGroupOwner = function(event, percents, groupOwnerId) {
  var email = getEmailByUserId(groupOwnerId);
  var totalPrice = 0;
  var totalReceipt = "<h>Hello Group made this is all orders from your group</h1>";

  for(var x = 0; x < event.users.length; x++) {
    var orders = event.users[x].orders;
    var username = getUserNameByUserId(event.users[x]._id);

    var { receipt, orderPrice } = fillReceipt(orders, username, percents);
    totalPrice += orderPrice;
    totalReceipt += receipt;
  }
  totalReceipt += '<table style="background-color: #7ef07a; border-style: solid; border-radius: 10px; margin: 10px; padding:10px"><tr><td><p style="margin:0">Total price: ' + totalPrice.toFixed(2) + '</p></td></tr></table>';
  sendEmail(email, totalReceipt);
}