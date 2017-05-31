import {Images} from './images';

Meteor.publish("images", function() {
  return Images.find();
});