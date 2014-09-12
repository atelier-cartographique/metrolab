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
	'core/live',
	'core/collections',
	'core/template',
	'leaflet',
	'plugins/workspace/Creator',
	'plugins/workspace/LayerForm',
	'plugins/marker/Marker',
	], 
function(log, proxy, _, T, Live, C, TP, L, Creator, LayerForm, Marker){
	'use strict';

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

			this.model.on('change', function(){
				this.render();
				if(this.visible){
					this.showFeatures();
				}
			}, this);

			Live('Entity').on('notify', function(model){
				if(model.get('layer_id') === this.model.id){
					this.renderEntity(model);
					if(!this.visible){
						var f = _.bind(this.removeFeatures, this);
						window.setTimeout(f, 2000);
					}
				}
			}, this);
		},

		style: function(feature){
			var props = this.model.get('properties');
			// TODO the styling thing based on the feature

			return _.extend({}, props.style); 
		},


		createEntityLayer: function(model, callback, ctx){
			var geometry = model.get('geometry');
			var type = ('geometry' in geometry) ? 
						geometry.geometry.type : 
						geometry.type;

			if('Point' === type){
				var marker = new Marker({model:model});
				marker.getMarker(function(layer){
					callback.apply(ctx, [layer]);
					
					layer.on('click', function(){
						this.editFeatureMeta(model);
					}, this);

				}, this);
			}
			else{
				var style = _.bind(this.style, this);
				var options = {
					style:style,
				};
				var layer = L.geoJson(geometry, options);
				
				layer.on('click', function(){
					this.editFeatureMeta(model);
				}, this);

				callback.apply(ctx, [layer]);
			}


			model.once('change', this.updateEntity, this);

			return this;
		},

		updateEntity: function(model){
			if(model.id in this.entities){
				var c = this.entities[model.id];
				var l = c.layer;
				if(l){
					this.group.removeLayer(l);
				}
				this.createEntityLayer(model, function(layer){
					c.layer = layer;
					this.group.addLayer(layer);	
				}, this);
			}
			else{
				this.renderEntity(model);
			}
			return this;
		},

		renderEntity: function(model){
			if(model.id in this.entities) return;
			this.createEntityLayer(model, function(layer){
				this.entities[model.id] = {
					model: model,
					layer: layer,
				};
				this.group.addLayer(layer);
			}, this);
			
			return this;
		},

        dataAvailable: function (data) {
            _.each(data.references, function (reference) {
            	this.renderEntity(reference);
            }, this);
            this.trigger('dataAvailable', this);
        },

        prepareData: function(){
			var data = this.model.toJSON().properties;
			log.debug('prepareData', data);

			data.fillColor = "";  					
			if(data.style){ 								
			  if('fillColor' in data.style){ 			
			  	data.fillColor = data.style.fillColor; 		
			  } 											
			} 											

			data.borderStyle = ""; 						
			if(data.style) { 							
				if('stroke' in data.style 					
				    && data.style.stroke) {					
			 			data.borderStyle = "; border: " 
			 								+ data.style.weight 
			 								+ "px solid " 
			 								+ data.style.color;
				  } 										
			} 		

			data.visible = this.visible;
			data.active = this.active;
			return data;									
        },

		render: function(){
			var data = this.prepareData();
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t(data));
			});
			return this;
		},

		selectLayer: function(e){
			this.trigger('select', this);
			this.$el.addClass('active');
			this.active = true;
			return this;
		},

		deselectLayer: function(){
			this.$el.removeClass('active');
			this.active = false;
			return this;
		},

		getBounds: function(){
			var bounds = this.group.getBounds();
			return new L.LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());
		},		

		zoomLayer: function(e){
			this.map.fitBounds(this.getBounds());
			return this;
		},

		showFeatures: function(){
			var self = this;
			_.each(self.entities, function(e, id){
				self.updateEntity(e.model);
			});
			self.trigger('features:end', this);
			return this;
		},

		removeFeatures: function(){
			var self = this;
			_.each(self.entities, function(e, id){
				log.debug('removeFeature', id);
				if(e.layer){
					self.group.removeLayer(e.layer);
				}
				self.entities[id].layer = null;
			});
			return this;
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
			return this.render();
		},

		settings: function (argument) {
			var form = new LayerForm({
				model:this.model
			});	
			proxy.delegate('modal', 'show', form);	
			return this;		
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
			return this;
		},

		editFeatureMeta: function(model){
			var creator = new Creator({model:model});
			proxy.delegate('modal', 'show', creator);
			return this;
		},
	});

	return Layer;	
});


