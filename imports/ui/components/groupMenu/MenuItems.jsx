import React, { Component, PropTypes } from 'react';
import keyIndex from 'react-key-index';

import Item from './Item';

export default class MenuItems extends Component {
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
  
  addNewItem(event) {
    event.preventDefault();
    var name = this.state.itemName;
    var price = this.state.itemPrice;

    Meteor.call('groups.addMenuItem', this.props.group._id, name, price);
    this.setState({itemName: '', itemPrice: ''});
    return null;
  }

  showMenuItems() {
    var items = this.props.group.menuItems;
    if(items && items != []){
      items = keyIndex(items, 1);
      let groupId = this.props.group._id;
      return items.map((item) => 
        <Item key={item._nameId} item={item} groupId={groupId}/>
      );
    } else {
      return null
    }
  }

  render() {
    console.log(this.props);
    if(this.props.group){
      return (
        <div>
          <h3>{this.props.group.name} Menu List </h3>
          <div className="menu-items-table">
            <div className="menu-item-row">
              <div className="menu-item-head"> Name </div>
              <div className="menu-item-head"> Price </div>
              <div className="menu-item-head"> Actions </div>
            </div>
            {this.showMenuItems()}
          </div>
          <form className="form-inline" onSubmit={this.addNewItem}>            
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
            <input type="submit" value="Create" />
          </form>
        </div>
      );
    } else {
      return <h1> Please press "menu items" button in one of group</h1>;
    }
  }
}