import { Meteor } from 'meteor/meteor';


exports.getUserEmail = function getEmailByUserId(userId) {
  const user = Meteor.users.findOne({ _id: userId });
  const email = user.profile
    ? user.services.google.email
    : user.emails[0].address;
  return email;
};

exports.getUserName = function getUserNameByUserId(userId) {
  const user = Meteor.users.findOne({ _id: userId });
  const username = user.profile
    ? user.profile.name
    : user.username;
  return username;
};
