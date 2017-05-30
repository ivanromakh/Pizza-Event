import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Events = new Mongo.Collection('events');
 
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('events', function groupsPublication() {
    return Events.find();
  });
}

Meteor.methods({
  'events.createEvent'(groupId, timestamp) {

    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Events.insert({
        groupId: groupId,
        date: timestamp,
        status: "ordering",
    });
  },

  'events.confirmUser'(eventId) {
    let userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.update({_id: eventId}, {$addToSet: {users: {_id: userId}}});
  },

  'events.createOrder'(eventId, orderName, orderPrice, orderCount) {
    let userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.update({_id: eventId, "users._id": userId}, 
      {$push: {"users.$.orders": {name: orderName, price: orderPrice, count: orderCount}}});
  }
});