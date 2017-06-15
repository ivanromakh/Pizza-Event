import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Events } from './events';


Meteor.methods({
  'events.createEvent'(groupId, timestamp) {
    check(groupId, String);
    check(timestamp, Number);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Events.insert({
      groupId,
      date: timestamp,
      status: 'ordering',
    });
  },

  'events.confirmUser'(eventId) {
    check(eventId, String);

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.update({ _id: eventId }, { $addToSet: { users: { _id: userId } } });
  },

  'events.createOrder'(eventId, orderName, orderPrice, orderCount) {
    check(eventId, String);
    check(orderName, String);
    check(orderPrice, Number);
    check(orderCount, Number);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.update({
      _id: eventId, 'users._id': userId,
    }, {
      $push: {
        'users.$.orders': {
          name: orderName,
          price: orderPrice,
          count: orderCount,
        },
      },
    });
  },

  'events.confirmOrder'(eventId) {
    check(eventId, String);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Events.update(
      { _id: eventId, 'users._id': userId },
      { $set: { 'users.$.confirm': true } },
    );
  },

  'events.changeStatus'(eventId) {
    check(eventId, String);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const event = Events.findOne({ _id: eventId });

    let update = false;
    let status = '';

    if (event.status && event.status === 'ordered') {
      status = 'delivering';
      update = true;
    } else if (event.status && event.status === 'delivering') {
      status = 'delivered';
      update = true;
    }

    if (update === true) {
      Events.update(
        { _id: eventId },
        { $set: { status } },
      );
    }
  },
});
