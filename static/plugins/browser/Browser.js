/*
 * browser/Browser.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify 
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
	'leaflet',
	'core/types',
	'core/collections',
	'core/template',
	'plugins/workspace/Layer',
	],	 
function (_, L, T, C, TP, Layer) {
	'use strict';
	
	// var BrowseLayer = Layer.extend({
	// 	template: 
	// });

	var LayerItem = T.Subview.extend({
		templateName: 'browser/layer-item',
		ready: true,
		className: "list-group-item",
	});

	var UserItem = T.ContainerView.extend({
		templateName: 'browser/user-item',
		subviewContainer : 'layers',
		SubviewPrototype: LayerItem,
		className: "BrowserUserItem",


		initialize: function(options){
			this.ready = true;
			this.cursor = C.Layer.forUser(this.model.id, this.dataAvailable, this);
		},

	});

	var Browser = T.ContainerView.extend({

		templateName: 'browser/browser',
		subviewContainer : 'users',
		SubviewPrototype: UserItem,
		className: "BrowserView",


		initialize: function(options){
			this.ready = true;
			this.cursor = C.User.browse(this.dataAvailable, this);
		},
	});

	return Browser;
});
