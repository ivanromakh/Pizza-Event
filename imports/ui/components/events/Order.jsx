import React from 'react';
import PropTypes from 'prop-types';

function Order(props) {
  const { name, price, count } = props.order;

  return (
    <div className="events-row">
      <div className="menu-item-name">{name}</div>
      <div className="menu-item-name">{price}</div>
      <div className="menu-item-name">{count}</div>
    </div>
  );
}

Order.propTypes = {
  order: PropTypes.object.isRequired,
};

export default Order;
