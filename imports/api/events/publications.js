import { Meteor } from 'meteor/meteor';

import { Events } from './events';


Meteor.publish('events', function publishEvents(groupId) {
  if (!this.userId && !this.groupId) {
    return this.ready();
  }

  return Events.find({ groupId });
});
