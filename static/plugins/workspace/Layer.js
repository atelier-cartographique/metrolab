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
	'leaflet',
	'plugins/workspace/Creator'
	], 
function(log, _, T, C, TP, L, Creator){

	var Layer = T.View.extend({

		className: 'layer',
		template: 'workspace/layer-item',

		events:{
			'click [data-role=select]': 'selectLayer',
			'click [data-role=zoom]': 'zoomLayer',
			'click [data-role=visible]': 'toggleVisible',
		},

		initialize: function(options){
			this.visible = !!('visible' in options) ? options.visible : true;
			this.map = options.map;
			this.group = new L.FeatureGroup();
			this.group.addTo(this.map);

			this.entities = {};
		},

		style: function(feature){
			var props = this.model.get('properties');
			// TODO the styling thing based on the feature

			return _.extend({}, props.style); 
		},

		renderEntity: function(e){
			if(e.id in this.entities) return;
			var geometry = e.get('geometry');

			var style = _.bind(this.style, this);
			var options = {
				style:style,
			};
			var layer = L.geoJson(geometry, options);
			
			layer.on('click', function(){
				log.debug('layer', e.id);
				var model =  this.entities[e.id].model;
				this.editFeatureMeta(model);
			}, this);
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
			data.visible = this.visible;
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t(data));
			});
			this.showFeatures();

			return this;
		},

		selectLayer: function(e){
			this.trigger('select', this);
			this.$el.addClass('active');
		},

		deselectLayer: function(){
			this.$el.removeClass('active');
		},

		getBounds: function(){
			var bounds = this.group.getBounds();
			return new L.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
		},		

		zoomLayer: function(e){
			this.map.fitBounds(this.getBounds());
		},

		showFeatures: function(){
			if(!this.cursor){
				this.cursor = C.Entity.forLayer(this.model.id, 
												this.dataAvailable, this);
			}
		},

		removeFeature: function(){
			
		},

		toggleVisible: function(){

		},

		createFeature: function(layer){
			var self = this;
			var model = C.Entity.add({
				layer_id:this.model.id,
				geometry:layer.toGeoJSON(),
				properties: {
					_main:''
				}
			});

			if(this.creator){
				this.creator.remove();
			}
			this.creator = (new Creator({model:model})).render();
			this.renderEntity(model);
		},

		editFeatureMeta: function(model){
			if(this.creator){
				this.creator.remove();
			}
			this.creator = (new Creator({model:model})).render();
		},
	});

	return Layer;	
});


