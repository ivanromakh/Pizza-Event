import { Meteor } from 'meteor/meteor';

import { Groups } from './groups';


Meteor.publish('userGroups', () => {
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
