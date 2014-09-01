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
	'core/eproxy',
	'underscore',
	'core/types',
	'core/collections',
	'core/template',
	'leaflet',
	'plugins/workspace/Creator',
	'plugins/workspace/LayerForm'
	], 
function(log, proxy, _, T, C, TP, L, Creator, LayerForm){

	var Layer = T.View.extend({

		className: 'list-group-item layer',
		template: 'workspace/layer-item',

		events:{
			'click [data-role=select]': 'selectLayer',
			'click [data-role=zoom]': 'zoomLayer',
			'click [data-role=visible]': 'toggleVisible',
			'click [data-role=settings]': 'settings',
		},

		initialize: function(options){
			this.visible = !!('visible' in options) ? options.visible : true;
			this.map = options.map;
			this.group = new L.FeatureGroup();
			this.group.addTo(this.map);

			this.entities = {};
			
			this.cursor = C.Entity.forLayer(this.model.id, 
												this.dataAvailable, this);
		},

		style: function(feature){
			var props = this.model.get('properties');
			// TODO the styling thing based on the feature

			return _.extend({}, props.style); 
		},


		createEntityLayer: function(model){
			var geometry = model.get('geometry');

			var style = _.bind(this.style, this);
			var options = {
				style:style,
			};
			var layer = L.geoJson(geometry, options);
			
			layer.on('click', function(){
				this.editFeatureMeta(model);
			}, this);

			model.once('change', this.updateEntity, this);

			return layer;
		},

		updateEntity: function(model){
			if(model.id in this.entities){
				var c = this.entities[model.id];
				var l = c.layer;
				if(l){
					this.group.removeLayer(l);
				}
				var layer = this.createEntityLayer(model);
				c.layer = layer;
				this.group.addLayer(layer);	
			}
			else{
				this.renderEntity(model);
			}
		},

		renderEntity: function(model){
			if(model.id in this.entities) return;
			var layer = this.createEntityLayer(model);
			this.entities[model.id] = {
				model: model,
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
			data.active = this.active;
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t(data));
			});
			return this;
		},

		selectLayer: function(e){
			this.trigger('select', this);
			this.$el.addClass('active');
			this.active = true;
		},

		deselectLayer: function(){
			this.$el.removeClass('active');
			this.active = false;
		},

		getBounds: function(){
			var bounds = this.group.getBounds();
			return new L.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
		},		

		zoomLayer: function(e){
			this.map.fitBounds(this.getBounds());
		},

		showFeatures: function(){
			var self = this;
			_.each(self.entities, function(e, id){
				self.updateEntity(e.model);
			});
		},

		removeFeatures: function(){
			var self = this;
			_.each(self.entities, function(e, id){
				log.debug('removeFeature', id);
				self.group.removeLayer(e.layer);
				self.entities[id].layer = null;
			});
		},

		toggleVisible: function(){
			if(this.visible){
				this.removeFeatures();
				this.visible = false;
			}
			else{
				this.showFeatures();
				this.visible = true;
			}
			this.render();
		},

		settings: function (argument) {
			var form = new LayerForm({
				model:this.model
			});	
			proxy.delegate('modal', 'show', form);			
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

			model.once('sync', this.renderEntity, this);
			var creator = new Creator({model:model});
			proxy.delegate('modal', 'show', creator);
		},

		editFeatureMeta: function(model){
			var creator = new Creator({model:model});
			proxy.delegate('modal', 'show', creator);
		},
	});

	return Layer;	
});


