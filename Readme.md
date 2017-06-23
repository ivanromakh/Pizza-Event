Pizza Event
===================

## About ##
This application didn`t use any route becouse of simple. 
This is one page application. Here I check only 
if user 'sign in'. If he sign in he can get any information except other user passports.

## Pages ##
    App              - all other start from them
    SignInPage       - login page
    SignUpPage       - register page
    HomePage         - information about project

## Components ##
    AccountUiWrapper - for sign in, sign out, google auth
    InviteForm       - this is for inviting someone in group
    CreateGroupForm  - here user can create a group
    ClientGroups     - show groups where user is a member 
    ShowClientGroups - render other components which render all users group and reffered group
    RefferedGroups   - render all groups which invited this user
    Group            - render one group. One component for owner reffered and paricipation group.
    MenuItems        - show menu items for "activeGroup"
    Item             - show item from menu items
    PizzaEvents      - show event creating form, orders and events like tables
    Event            - show each event for this group it status and date
    EventOrdering    - component for make orders and also show orders in table
    Order            - for each order from table, show each row of table
    AcceptButton     - this component is for refered groups for acception them to local groups
    ShowEventsButton - load PizzaEvents component into App page with ordering and events
    ShowMenuButton   - load MenuItems component into App page

## Mongo DataBase ##

 ### Users collection ###
    activeGroup - id of group which present right now in the page
    activeEvent - id of event which present right now in the page 
    invitations - ids of groups which are invited user
    groups      - ids of groups which user are accepted in the page
    ...

 ### Groups collection ###
    users     - clients which accepted group
    menuItems - menu items which clients write for this group have 'name' and 'price'
    ...

 ### Events collection###
    groupId - id of group which create event
    date    - time for event 
    users   - this is not very good thing where I put orders maybe I should create orders collection. There is user '_id' and his 'orders'. Orders has next fields: count, price and name.
    status  - can be ordering. 
    ...

 ### Used modules ###
    bcrypt - for sign in encryption password
    react  - client framework
    react-calendar  - this is component for getting time. Used for events date.
    react-select    - very cool component. Used for selection users and menu items.
...

## Install instructions ##
For installing on Windows write next commands in commandline
```
    meteor npm install
    mkdir settings
    echo settings>settings.json
```
Then put this content in settings.json
```
{
    "smtp": "Your smtp service (gmail not working on this meteor version)",
    "google": {
        "clientId": "your google api clientId",
        "secret": "your google api secret"
    }
}
```
