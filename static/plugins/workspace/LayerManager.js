/*
 * workspace/LayerManager.js
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
	'plugins/workspace/Layer'
	],	 
function (_, T, C, TP, Layer) {
	'use strict';

	var LayerManager = T.View.extend({

		template: 'workspace/layer-widget',

		events: {
			'click .layer-create': 'createLayer',
		},

		initialize: function(options){
			this.layers = [];
			this.currentLayer = undefined;
			this.ready = false;
			this.rendered = false;
		},

		render:function(){
			TP.render(TP.name(this.template), this, function(t){
				this.$el.html(t({}));
				this.rendered = true;
			});
			return this;
		},

		start: function(map, user){
			this.map = map;
			this.user = user;
			C.Layer.forUser(user.id, this.addLayers, this);
			this.ready = true;
		},

		addLayers: function(data){
			if(!this.rendered){
				var self = this;
				return window.setTimeout(function(){
					self.addLayers(data);
				}, 400);
			}
			_.each(data.references, this.renderLayerItem, this);
		},

		renderLayerItem: function(layer){
			var layerItem = new Layer({
				model:layer,
				map:this.map,
			}); 
			this.layers.push(layerItem);
			// this.$el.append(layerItem.render().$el);
			this.attachToAnchor(layerItem.render(), 'items');

			var self = this;
			layerItem.on('select', function(l){
				_.each(self.layers, function(ly){
					if(ly !== l) ly.deselectLayer();
				});
				self.currentLayer = l;
			});

			if(!this.currentLayer){
				layerItem.selectLayer();
			}
		},

		getCurrentLayer: function(){
			return this.currentLayer;
		},

		createLayer: function(){
			if(!this.ready) return;
			var $input = this.$el.find('[name=layer-name]');
			var name = $input.val();
			if(name && name.trim().length > 0){
				C.Layer.create({
					user_id:this.user.id,
					properties:{
						name:name.trim(),
					}
				},{
					wait:true
				}).on('sync', this.renderLayerItem, this);
			}
			$input.val('');
		},
	});


	return LayerManager;
})