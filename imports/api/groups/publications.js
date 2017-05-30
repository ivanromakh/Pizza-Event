import { Meteor } from 'meteor/meteor';

import { Groups } from './groups';


Meteor.publish('groups', () => { 
  return Groups.find();
});