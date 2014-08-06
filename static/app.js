/*
 * app.js
 *     
 * 
 Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 
 This program is free software: you can redistribute it and/or modify 
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


var deps = [
	'core/types',
	'jquery'
];

define(deps, 
function(T, $){
	var App = T.View.extend({
		
		className: 'app',

		render: function(){
			$('body').append(this.$el);
		},

		start: function(){
			this.trigger('ready');
		},
	});
	var app = new App;
	return app;
});