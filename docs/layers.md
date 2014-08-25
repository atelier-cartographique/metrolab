layers
======

A layer is a thematics group of entities, all displayed at once.
They are created manualy by users or out of imported datas.



# Layer creation

Button "add layer" :
- close all open widgets (except notifications) 
- open layer information widget in edition mode (top-left) 
- map edition tools + *save* button appear on top-left of the map viewport

The user has to give the layer : 

- a name
- a description

The user can chose : 

- a fill color + attribut to generate a color gradient
- a stroke color (not a priority) + attribut to generate the stroke thickness


* About attribut and style : to display the list of all the entities key + min value/max value of the current layer would be helpfull (to chose the attribut for the gradient, and to have a reminder when adding an entity)* 

# Layer edition

- Layers belonging to a user can be edited by him.
- User can modify anything (layer infos, color, entities)
- Modifications has to be saved by the user.
- When a layer is being edited, it is displayed on top the others.


# Layer visualization


## Entities

On-click : 
- close all open widgets (except notifications ) 
- open layer information widget (top-left) 

## Visual aspects

Each layer as a color defined by its author during the layer creation.

Gradients of that color are generated for entities, based on an attributs chosen by the user.

Outlines and strokes are also generated for entities, based on an attributs chosen by the user.


### points 

*Markers / Icons*

The icon of the marker will be automaticaly generated from an attributs. (eg name)

First two characters of the point attribut are used as symbole for the marker. 
First letter capitalzed, the second is not. (See periodic element table as reference).
Square, flat design.


TBC : Below this symbol, the exact name used to create the symbole is displayed. Small font. 
(that could go in the legend)


### lines 

general behavior as described above

### polygons 

general behavior as described above

### circles

general behavior as described above

### texts

font-color : layer-color
no outline
size defined by user


### shapefiles 

general behavior as described above
+ automatic generation of Markers / Icons, see above.















