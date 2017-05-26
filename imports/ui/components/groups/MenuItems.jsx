import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';

import { Groups } from '../../../api/groups.js';


class MenuItems extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      itemName: '',
      itemPrice: '',
    }

    this.addNewItem = this.addNewItem.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  }

  handleNameChange(event) {
    this.setState({itemName: event.target.value});
  }

  handlePriceChange(event) {
    this.setState({itemPrice: event.target.value});
  }
  
  addNewItem() {
    event.preventDefault();
    var name = this.state.itemName;
    var price = this.state.itemPrice;
    if (Meteor.userId()) {
      Meteor.call('groups.addMenuItem', name, price);
      this.setState({itemName: '', itemPrice: ''});
    }
    return null;
  }

  render() {
    console.log(this.props);
    if(this.props.group){
      return (
        <div>
          <p>{this.props.group.name} Menu List </p>
          <form className="form-inline">
            <div className="form-group">
              <label> Product Name: </label>
              <input
                value={this.state.itemName}
                className="form-control"
                type="text"
                onChange={this.handleNameChange}
              />
            </div>
            <div className="form-group">
              <label> Price: </label>
              <input
                value={this.state.itemPrice} 
                className="form-control" 
                type="text"
                onChange={this.handlePriceChange}
              />
            </div>
            <button> Create new item</button>
          </form>
        </div>
      );
    } else {
      return <h1> Please press "menu items" button in some group</h1>;
    }
  }
}

export default createContainer(() => {
  Meteor.subscribe('groups');

  if(Meteor.user()) {
    console.log('555', Meteor.user());
    var activeGroup = Meteor.user().activeGroup;
    console.log(activeGroup);
    if(activeGroup) {
      return {
        group: Groups.findOne({_id: activeGroup}),
      }
    }
  }
  return {};
}, MenuItems);