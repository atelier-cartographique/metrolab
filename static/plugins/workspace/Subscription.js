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
	'core/types',
	'core/collections',
	'core/template',
	'leaflet',
	'plugins/workspace/Layer'
	],	 
function (_, T, C, TP, L, Layer) {
	'use strict';

	var GroupItem = T.BView.extend({

		templateName: 'workspace/group-item',

		events:{
			'click' : 'fitGroup',
		},
		
		initialize: function(options){
			this.layers = [];
			this.map = options.map;
			_.each(this.model.get('layers'), this.addLayer, this);
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
			this.layers.push(layer);
		},


		showLayers: function(){
			_.each(this.layers, function(layer){
				layer.showFeatures();
			});
		},

		fitGroup: function(){
			var bounds;
			_.each(this.layers, function(layer){
				if(!bounds){
					bounds = layer.group.getBounds();
				}
				else{
					bounds.extend(layer.group.getBounds());
				}
			});
			this.map.fitBounds(bounds);
		},

	});

	var Subscription = T.View.extend({

		template: 'workspace/subscription',

		initialize: function(options){
			this.groups = {};
			this.ready = false;
		},

		render: function(){
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t({}));
				this.rendered = true;
			});
			return this;
		},

		start: function(map, user){
			var self = this;
			self.map = map;
			self.user = user;
			var groups = user.get('groups');

			_.each(groups, function(groupData){
				var group = C.Group.getOrCreate(groupData.id, function(model){
					self.groups[model.id] = new GroupItem({
						model: model,
						map: self.map
					})
					
					self.groups[model.id].on('rendered', function(){
						self.groups[model.id].showLayers();
					});
					self.attachToAnchor(self.groups[model.id].render(), 'items');
				}, ['layers'], self);
			})

		},

	});


	return Subscription;

});