import { Meteor } from 'meteor/meteor';

import { Events } from './events';


Meteor.publish('events', () => {
  return Events.find();
});