import { Meteor } from 'meteor/meteor';

import { Groups } from './groups';

// publish groups where users belong to.
Meteor.publish('groups', function() { 
  var userId = this.userId;
  return Groups.find({
  	$or: [
  	  { users: { $elemMatch: { _id: userId }}}, 
  	  { invitations: {$elemMatch: { _id: userId }}},
    ]
  });
});