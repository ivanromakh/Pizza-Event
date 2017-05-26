This application didn`t use any route becouse very simple. 

Components
App              - all other start from them
AccountUiWrapper - for sign in, sign out, google auth
InviteForm       - this is for inviting someone in group
CreateGroupForm  - here user can create a group
ClientGroups     - show groups where user is a member 
ShowClientGroups - render other components which render all users group and reffered group
RefferedGroups   - render all groups which invited this user
Group            - render one group. One component for owner reffered and paricipation group.
MenuItems        - show menu items for "activeGroup"

