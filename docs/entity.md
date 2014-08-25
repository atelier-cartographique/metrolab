Entity
======

Tools to draw entities and attach informations / attributs to them:

- points
- lines
- polygons
- import shapefiles
- text notes

optionaly:

- images (medias) 
- import .gpx files

*save*, *delete* are in the info-box
NO *edit* since we can edit on the fly

## General behavior

- Additionnal informations can be attached to each entity, stored as (key,value).
- The interface provide some general keys to guide the user and keep a clean storage of the most common informations (title, description, etc).
- Using any of the tool close down all open widgets.
- The editor widget appears on the left sidebar once the drawing is done.
- Those informations will be then displayed where the info editor was.


### usage scenario

1- the user create an entity with one of the provided tools (point, line, polygon etc.)
2- once the entity is created, the information box appear like described in the related doc (information.md)
3- user fills the infos
4- user save the entity
5- info-box closed, entity saved



# TOOLS

## Points

multiple (key,value) possible
A typographic pictogram is generated out of a (key,value)
- out of default *name* field ? 
- out of other attribut user can chose ? 

## Lines 

multiple (key,value) possible

## Polygons

multiple (key,value) possible

## Shapefile Import
can create multiple entities

## text-notes

Text notes can be added by user by : 
- click on text icon
- click & drag the text zone box
- type the text

 *add (key,value) ? is the text a (value) ?*

### Text zone

What if text cannot fit in the box ? 
- box auto expand in height (bottom) ?
- typing blocked at the end of the box --> user has to resize the box ?
- typing ok, box doesn't expand, text disapear out of the box  --> user has to resize the box ?
- scroll ?



### Font-size

Font-size when typing is fixed.
Font-size sticks to the active zoom level when saved.

eg:	- text saved at zoom 4 will be huge at zoom 15
	- text saved at zoom 15 will be very small at zoom 4



### Goodies : 
	- copy-paste
	- font-family choices
	- so much to add :) 
