import { Meteor } from 'meteor/meteor';

import {Images} from './images';


Meteor.publish('images', function() {
  return Images.find();
});