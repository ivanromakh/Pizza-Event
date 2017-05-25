import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import ShowClientGroups from './groups/ShowClientGroups';
import CreateGroupForm from './groups/CreateGroupForm';
import AccountUiWrapper from './AccountUiWrapper'; 

// App component - represents the whole app
export default class App extends Component {
 
  render() {
    return (
      <div className="container">
        <div className='row'>
          <div className="col-md-8">
  		      <div className='thumbnail left-column'>
              <h1> Pizza Ordering </h1>
  		      </div>
  		    </div>
            <div className="col-md-4">
  		        <div className='thumbnail right-column'>
  		          <AccountUiWrapper />
  		          <CreateGroupForm />
  		          <ShowClientGroups />
  		      </div>
          </div>
	      </div>
      </div>
    );
  }
}