import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Events } from './events';


Meteor.publish('events', function publishEvents(groupId) {
  check(groupId, String);

  if (!this.userId && !groupId) {
    return this.ready();
  }

  return Events.find({ groupId });
});
