import { Meteor } from 'meteor/meteor';

import { Groups } from './groups';


Meteor.publish('userGroups', function publishGroups() {
  const userId = this.userId;

  if (!this.userId) {
    return this.ready();
  }
  return Groups.find({ users: { $elemMatch: { _id: userId } } });
});

Meteor.publish('referedGroups', function publishGroups() {
  const userId = this.userId;

  if (!this.userId) {
    return this.ready();
  }

  return Groups.find({ invitations: { $elemMatch: { _id: userId } } });
});
