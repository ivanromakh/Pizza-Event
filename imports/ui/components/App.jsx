import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import ShowClientGroups from './groups/ShowClientGroups';
import CreateGroupForm from './groups/CreateGroupForm';
import MenuItems from './groups/MenuItems';
import AccountUiWrapper from './AccountUiWrapper'; 

// App component - represents the whole app
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeGroup: false,
    };
  }

  render() {
    return (
        <div className="container noColor">
          <div className='row'>
            <div className="col-md-8">
  		        <div className='left-column'>
                <h1> Pizza Ordering </h1>
                <p>{ this.state.activeGroup }</p>
                <MenuItems groupId={ this.state.activeGroup } />
  		        </div>
  		      </div>
              <div className="col-md-4">
  		          <div className='right-column'>
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