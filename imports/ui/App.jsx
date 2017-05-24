import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


import AccountUiWrapper from './AccountUiWrapper.jsx'; 

// App component - represents the whole app
export default class App extends Component {
 
  render() {
    return (
      <AccountUiWrapper />
    );
  }
}