import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

process.env.MAIL_URL = Meteor.settings.smtp;

/*Accounts.config({
  sendVerificationEmail: true,
});*/

ServiceConfiguration.configurations.upsert({
  service: 'google',
}, {
  $set: Meteor.settings.google,
});
