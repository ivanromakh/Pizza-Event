import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Groups } from './groups';


Meteor.publish('userGroups', function publishGroups() {
  const userId = this.userId;

  if (!this.userId) {
    return this.ready();
  }
  return Groups.find({
    $or: [
      { users: { $elemMatch: { _id: userId } } },
      { invitations: { $elemMatch: { _id: userId } } },
    ],
  });
});

Meteor.publish('getGroupById', function getGroup(groupId) {
  check(groupId, String);
  const userId = this.userId;

  if (!this.userId) {
    return this.ready();
  }

  return Groups.find({
    $or: [
      { users: { $elemMatch: { _id: userId } } },
      { invitations: { $elemMatch: { _id: userId } } },
    ],
  });
});
