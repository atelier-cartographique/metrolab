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
	'core/logger',
	'underscore',
	'core/types',
	'core/collections',
	'core/template',
	'leaflet'
	], 
function(log, _, T, C, TP, L){

	var Layer = T.View.extend({

		className: 'layer',
		template: 'workspace/layer-item',

		events:{
			'click .layer-name': 'selectLayer',
			'click .layer-zoom': 'zoomLayer',
		},

		initialize: function(options){
			this.visible = !!('visible' in options) ? options.visible : true;
			this.map = options.map;
			this.group = new L.FeatureGroup().addTo(this.map);

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
            _.each(data.references, function (reference) {
            	this.renderEntity(reference);
            }, this);
            this.trigger('dataAvailable', this);
        },

		render: function(){
			var data = this.model.toJSON().properties;
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t(data));
			});


			return this;
		},

		selectLayer: function(e){
			this.trigger('select', this);
			this.$el.addClass('active');
			this.showFeatures();
		},

		deselectLayer: function(){
			this.$el.removeClass('active');
		},

		zoomLayer: function(e){
			this.map.fitBounds(this.group.getBounds());
		},

		showFeatures: function(){
			if(!this.cursor){
				this.cursor = C.Entity.forLayer(this.model.id, 
												this.dataAvailable, this);
			}
		},

		createFeature: function(layer){
			var self = this;
			C.Entity.create({
				layer_id:this.model.id,
				geometry:layer.toGeoJSON(),
				properties: {
					xxYY:'AAAA'
				}
			},{
				wait:true,
			}).on('sync', function(model){
				self.renderEntity(model);
			});
		},
	});

	return Layer;	
});


