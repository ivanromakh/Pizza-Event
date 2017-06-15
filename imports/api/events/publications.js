import { Meteor } from 'meteor/meteor';

import { Events } from './events';


Meteor.publish('events', function publishEvents() {
  if (!this.userId) {
    return this.ready();
  }

  return Events.find();
});
