import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Groups = new Mongo.Collection('groups');
 
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('groups', function groupsPublication() {
    return Groups.find();
  });
}

Meteor.methods({
  'groups.create'(name) {
    check(name, String);
 
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.insert({
        name,
        owner: Meteor.userId(),
        username: Meteor.user().username,
        users: [],
    });
  },
  'groups.acceptUser' (groupId, user) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }


    // if user use google 
    if(user.profile) {
      Groups.update({_id: groupId}, {$addToSet: {users: {_id:user._id, username: profile.name}}});
    }
    if(user.username) {
      Groups.update({_id: groupId}, {$addToSet: {users: {_id:user._id, username: user.username}}});
    }
  },
});