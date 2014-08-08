information
===========

The information widget displays all infos attached to an entity.

The infos widget appear on the left side of the screen when a user click on an entity. 

If the entity is part of a layer that belong to the current user, it can be directly edited.

To make a visual relation between that specific entity and the info-box several option can be explored : 

- Display a visual line connecting the entity to the info-box.
- Add an additional border on the entity 
- Highlight the entity
- ...


The entity info-box displays : 

- name
- description
- (key,value)
- if entity belong to current user :
	- +add (key,value) 
	- *save* button 
	- *delete* button

## Design : 

re-use the current layer style (color, current gradient, stroke etc. ) for visual coherency.


## goodies

Add ability to attach medias (imgs, videos, etc..)
Html descriptions