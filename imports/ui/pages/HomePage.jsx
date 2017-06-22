import React from 'react';


function HomePage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2 well well-sm">
          <h1> Hello Guy or Girl </h1>
          <p> This is awasome site for <b>Pizza Ordering</b></p>
          <p> Here you can regestry, create groups, create events and make orders</p>
          <p>
            If you wanna to create groups or make orders you should clicked
            <b>Pizza</b> in the <b>main menu</b>
          </p>
          <p>
            When you create group you should invite friends to your group.
            Near each group you can see few buttons like <b>Show users</b>,
            <b>Menu</b> and <b>Events</b>
          </p>
          <p> So you can edit menu items by clicking <b>Menu</b> button</p>
          <p> For creation events you should click <b>Events</b> button</p>
          <p>
            After event creation you and your friend should accept event and then
            make orders, but before making orders you have to create some menu items
          </p>
          <p> Only when you and all your friends makes orders status will chage to
            <b>ordered</b> and only then you will be able to change status to
            delivering and delivered by clicking <b>Change status button</b>
          </p>
          <p> Now it should be much more easy to make orders</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
