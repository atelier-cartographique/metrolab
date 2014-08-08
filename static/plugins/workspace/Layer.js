/*
 * workspace/Layer.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify *
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


define([
	'logger',
	'underscore',
	'core/types',
	'core/collections',
	'leaflet'
	], 
function(log, _, T, C, L){

	var Layer = T.View.extend({

		className: 'layer',

		initialize: function(options){
			this.visible = !!('visible' in options) ? options.visible : true;
			this.map = options.map;
			this.group = new L.LayerGroup().addTo(this.map);

			this.entities = {};
		},

		renderEntity: function(e){
			if(e.id in this.entities) return;
			var geometry = e.get('geometry');
			var layer = L.geoJson(geometry);
			this.entities[e.id] = {
				model: e,
				layer: layer,
			};
			this.group.addLayer(layer);
		},

        dataAvailable: function (data) {
            data = this.prepareData(data);
            _.each(data.references, function (reference) {
                var subview = this.instantiateSubview(reference);
                this.includeSubview(subview);
            }, this);
            this.trigger('dataAvailable', this);
        },

		render: function(){
			if(!this.cursor){
				this.cursor = C.Entity.forLayer(this.model.id, 
												this.dataAvailable, this);
			}
		},

	});

});


