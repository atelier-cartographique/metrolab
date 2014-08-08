metrolab - web application
==========================


This documentation describes components, features and behaviours that we expect to experience when using the *metrolab* web application. 



## basics

*metrolab* is a colaborative mapping program. As such, its main interface is built upon a geographic viewport equipped with editing tools.


## glossary

In the following documentation we assume that 

- a single layer is called a *layer* 
- a group of layers is called a *map*.
- a point, line, polygon etc is called an *entity*

## modules

- map
- drawing tools
- layers switcher + new
- subscribtion widget 
- general index
- legends
- information display
- notifications area


## structure

First page --> only Login + Description text + contact

### once logged in : 

- the map is used as the background of the viewport
- user related widgets and buttons are collapsed and spread around the viewport to preserve map visibility.

	- top-left : user's layers list and "add layer" widgets
	- top-left : user's maps and subscribed layers widgets
	- bottom-left : logo, info/about link, logout etc..
	- left : entity info widget (when clicked on entity)
	- bottom-right : notifications widgets
	- right : layers legend

-Independant pages / modules : 

	-layers index 
	-infos and contacts
