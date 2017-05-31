import { Meteor } from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

import '../imports/api/events/events';
import '../imports/api/events/publications';
import '../imports/api/events/methods.js';
import '../imports/api/groups/groups.js';
import '../imports/api/groups/publications.js';
import '../imports/api/groups/methods.js';
import '../imports/api/users/publications.js';
import '../imports/api/users/methods.js';
import '../imports/api/images/images.js';
import '../imports/api/images/publications.js';
import '../imports/startup/server/check_ordering.js';


Meteor.startup(function () {
  process.env.MAIL_URL = Meteor.settings.smtp;

  Accounts.config({
    sendVerificationEmail: true
  });

  ServiceConfiguration.configurations.upsert(
    { service: "google" },
    { $set: Meteor.settings.google }
  );
});