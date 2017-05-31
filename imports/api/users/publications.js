import { Meteor } from 'meteor/meteor';


Meteor.publish('users', function groupsPublication() {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1, 
    username: 1, invitations: 1, groups: 1, activeGroup: 1, activeEvent: 1}});
});