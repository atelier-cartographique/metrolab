notifications
=============

The notification widget displays in real-time updates made on each layer and map the user subscribed to.


## To be displayed : 

- layer name
- entity name
- creation / edition / deletion
- date and time
- user name
- button *show all*

Eg : 17/08/14 12:09:34 *user1* added *entity name* on layer *layer name* 


Notification widget 
- is collapsible
- is at bottom-right of the screen
- is 60px height with 5 last updates displayed when expanded


## Design : 

Optionnal : Use the concerned layer color somewhere (eg font-color).


## goodies

- display each element as link (user, entity, layer)
- can be expanded in two steps 
	- step 1 : monitor the 5 last updates (60px height)
	- step 2 : *show all* --> expand to the top, with pager or scroll bar.
