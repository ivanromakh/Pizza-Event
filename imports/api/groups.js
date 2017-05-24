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
 
    // Make sure the user is logged in before inserting a task
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
  'groups.remove'(taskId) {
    check(taskId, String);
 
    Tasks.remove(taskId);
  },
});