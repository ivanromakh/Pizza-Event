process.env.MAIL_URL = Meteor.settings.smtp;

  Accounts.config({
    sendVerificationEmail: true
  });

ServiceConfiguration.configurations.upsert(
  { 
  	service: "google" 
  }, {
   $set: Meteor.settings.google 
  }
);