import React from 'react';
import { Meteor } from 'meteor/meteor';
import browserHistory from 'react-router/lib/browserHistory';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import { render } from 'react-dom';

import App from '../../ui/pages/App.jsx';
import AppLayout from '../../ui/layouts/AppLayout.jsx';
import SignInPage from '../../ui/pages/SignInPage.jsx';
import SignUpPage from '../../ui/pages/SignUpPage.jsx';
import HomePage from '../../ui/pages/HomePage.jsx';


export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppLayout}>
      <IndexRoute component={HomePage} />
      <Route path="/pizza" component={App} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
    </Route>
  </Router>
);

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app-container'));
});
