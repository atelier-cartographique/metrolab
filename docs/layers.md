layers
======

Layers are thematic maps created by users or out of imported datas.



# Layer creation

Button "add layer" :
-close all open widgets (except notifications ?) 
-open layer information widget in edition mode (top-left) 
-map edition tools + *save* button appear on top-left of the map viewport

The user has to give the layer : 

- a name
- a description
- a fill color
- a stroke color (?) 
- + possibility to add other (key,value) 


# Layer edition


-All layers belonging to a user can be directly edited by him.

-Modifications has to be saved by the user.

-When visualizing a group of layers, an *edit* button or equivalent is 
displayed for each layer belonging to the current user in the legend.

-When a layer is in edition mode, it is displayed on top the others.





# Layer general visualization


## Entities

On-click : i
-close all open widgets (except notifications ?) 
-open layer information widget (top-left) 

## Visual aspects

Each layer as a color defined by its author during the layer creation.

Gradients of that color are generated for entities, based on their attributs.

Outlines and strokes are also generated for entities, based on their attributs.


### points 

*Markers / Icons*

The icon of the marker will be automaticaly generated out of point attributs. (eg name)

First two characters of the point attribut are used as symbole for the marker. 
First letter capitalzed, the second is not. (See periodic element table as reference).
Square, flat design.


TBC : Below this symbol, the exact name used to create the symbole is displayed. Small font. 
(that could go in the legend)


### lines 

general behavior as describe above

### polygons 

general behavior as describe above

### circles

general behavior as describe above

### texts

font-color : layer-color
no outline
size defined by user

### shapefiles 

general behavior as describe above
+ automatic generation of Markers / Icons, see above.















