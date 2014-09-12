/*
 * marker/Marker.js
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
	'leaflet',
	'core/logger',
	'core/types',
	'core/template',
	],	 
function (_, L, log, T, TP) {
	'use strict';

	var markerOptions = ['templateName', 'className'];
	var Marker = T.BView.extend({
		templateName: 'marker/marker',
		className: 'marker',
		ready: true,

		initialize: function(options){
			_.extend(this, _.pick(options, markerOptions));

			var geometry = this.model.get('geometry');
			this.layer = L.geoJson(geometry);
			
		},

		getMarker: function(callback, ctx){
			var self = this;
			if(!this.html){
				self.once('rendered', function(){
					self.getMarker(callback, ctx);
				});
				return false;
			}
			if(!this.marker){
				this.icon = L.divIcon({
					className: 'marker-icon',
					html: this.html,
				});
				var point = this.layer.getBounds().getCenter();
				this.marker = L.marker(point, {icon: this.icon});
			}
			callback.apply(ctx, [this.marker]);
			return true;
		},

	});

});