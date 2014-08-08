legends
=======

The legend widget is used :
- as a legend for the current visible map
- as a tool box for organizing the current visible map 

The legend widget appear on right of the screen


The legend widget provides : 

- map informations

	- a *name* field for the map
	- a *description* field for the map
	- +add other (key,value) (?)

- list of visibles layers in their order of appearance

	- functions per layer (not collapsible, goes next to layers title)

		- re-order function (icon + drag and drop layer title in the list)
		- ability to show/hide each layer (icon)
		- ability to remove a layer from the map (icon)
			- ask confirmation to user
		- *edit* button for each layer belonging to the current user (icon)

	- legend of each layer (collapsible)

		- Layer name 
			- (header of the collapsible block, use the layer color for design)
		
		- Description and others (key,value)
			-(maybe a global link openning another box with thoses infos ?)
		
		- legend items, generated from layer styles (color and outline)
			- color gradients in small squares (15px) + attribut value
			- outline strokes (30px)+ attribut value
			- alpha gradients + attribut value (?)
			- markers legend in layer's color (generated pictos + attribut value)



