/*
 * main.js
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


requirejs.config({
    baseUrl: '/',
    paths: {
        "jquery": "jquery/jquery.min",
        'backbone': 'backbone/backbone-min',
        'underscore': 'underscore/underscore-min',
        'leaflet': 'leaflet/leaflet-src',
        'leaflet-draw': 'leaflet/leaflet.draw',
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'leaflet-draw' : {
            deps:['leaflet']
        },
    },
});


requirejs(['backbone', 'app', 'core/routers', 'core/eproxy'],
function(Backbone, app, routers, P){
    'use strict';
    
    $(document).ready(function(){

        app.once('ready', function(){
            console.log('APP READY');
            
            
            // render app
            app.render();

            // setup main router
            Backbone.history.start({pushState: true});
        });
        
        var router = new routers;
        P.register('router', router);
        app.start();
    });
    
});