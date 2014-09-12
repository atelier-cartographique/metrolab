/*
 * workspace/Subscription.js
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
	'underscore',
	'core/logger',
	'core/eproxy',
	'core/types',
	'core/collections',
	'core/template',
	'leaflet',
	'plugins/workspace/Layer'
	],	 
function (_, log, proxy, T, C, TP, L, Layer) {
	'use strict';

	var GroupItem = T.BView.extend({
		className: 'group-item panel panel-default',
		templateName: 'workspace/group-item',

		events:{
			'click' : 'fitGroup',
		},
		
		initialize: function(options){
			this.layers = [];
			this.map = options.map;

			this.on('rendered', function(self){
				_.each(self.model.get('layers'), self.addLayer, self);
			});
			
			this.ready = true;
		},

		templateData: function(){
			return this.model.toJSON().properties;
		},

		addLayer: function(attrs){
			var model = new C.Layer.model(attrs);
			var layer = new Layer({
				model: model,
				map: this.map
			});
			this.layers.push(layer.render());
			layer.addClass('pull-right');
			this.attachToAnchor(layer, 'group-layers');
		},


		showLayers: function(){
			_.each(this.layers, function(layer){
				layer.showFeatures();
			});
		},

		removeLayers: function(){
			_.each(this.layers, function(layer){
				layer.removeFeatures();
				layer.remove();
			});
		},

		fitGroup: function(){
			var bounds = undefined;
			_.each(this.layers, function(layer){
				if(!bounds){
					bounds = layer.getBounds();
				}
				else{
					bounds.extend(layer.getBounds());
				}
			});
			log.debug('fitGroup', bounds.toBBoxString());
			this.map.fitBounds(bounds);
		},

	});

	var Subscription = T.View.extend({

		template: 'workspace/subscription',

		initialize: function(options){
			this.groups = {};
			this.ready = false;
			this.rendered = false;
			proxy.register('Subscription', this);
		},

		render: function(){
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t({}));

			console.log('subscription.rendered');
				this.rendered = true;
			});
			return this;
		},

		addGroup: function(model){
			var self = this;

			if(!self.map){
				if(!self.pendingGroups){
					self.pendingGroups = [];

					self.once('map:ready', function(){
						_.each(self.pendingGroups, function(g){
							self.addGroup(g);
						});
					});

				}
				self.pendingGroups.push(model);

				return;
			}

			self.groups[model.id] = new GroupItem({
						model: model,
						map: self.map
					})
					
			self.groups[model.id].on('rendered', function(){
				self.groups[model.id].showLayers();
			});
			console.log('addGroup');
			if(this.rendered){
				self.attachToAnchor(self.groups[model.id].render(), 'items');
			}
			else{
				self.on('rendered', function(){
					self.attachToAnchor(self.groups[model.id].render(), 'items');
				});
			}
			
		},

		removeGroup: function(model){
			if(!self.map){return;}
			var group = self.groups[model.id];
			if(group){
				group.removeLayers();
				group.remove();
			}
			
		},

		start: function(map, user){
			var self = this;
			self.map = map;
			self.user = user;
			var groups = user.get('groups');

			_.each(groups, function(groupData){
				C.Group.getOrCreate(groupData.id, self.addGroup, self);
			});
			self.trigger('map:ready');
		},

	});


	return Subscription;

});