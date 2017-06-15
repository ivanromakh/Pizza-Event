import React from 'react';
import { Meteor } from 'meteor/meteor';
import browserHistory from 'react-router/lib/browserHistory';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import { render } from 'react-dom';

import App from '../../ui/components/App.jsx';


export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
);

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app-container'));
});
