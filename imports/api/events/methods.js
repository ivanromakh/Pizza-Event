import { Events } from './events';

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
  },

  'events.confirmOrder'(eventId) {
    let userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.log('ffff', userId);
    Events.update({_id: eventId, "users._id": userId},
      {$set: {"users.$.confirm": true}});
  }
});