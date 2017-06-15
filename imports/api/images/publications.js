import { Meteor } from 'meteor/meteor';

import { Images } from './images';


Meteor.publish('images', function publishImages() {
  if (!this.userId) {
    return this.ready();
  }

  return Images.find();
});
