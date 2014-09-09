

var store = require('./store');



var user = new store.User({
	name:'pierre@pierre.com',
	password: 'plokplok'
});


var user2 = new store.User({
	name:'plok@plok.com',
	password: 'plokplok'
});

var sublayer, sublayer2;

user2.save().then(function(){
	console.log('saved user plok@pierre.com', user2.id);


	var lyer = new store.Layer({
		user_id: user2.id,
		type:'geojson',
		properties: {
			name: 'plok layer 1',
			description: 'This is a beautiful layer about whatever you want',
		}
	});

	var lyer2 = new store.Layer({
		user_id: user2.id,
		type:'geojson',
		properties: {
			name: 'plok layer 2',
			description: 'This is another beautiful layer about whatever you want',
		}
	});



	sublayer = lyer;
	sublayer2 = lyer2;

	lyer.save().then(function(){
		console.log('saved layer "test layer"', lyer.id);

		var entity = new store.Entity({
			layer_id : lyer.id,
			properties:{
				_main: 'une entite qui dechire sa mere 1'
			},
			geometry: {
			    "type": "Point",
			    "coordinates": [
			        -105.01621,
			        39.57422
			    ]
			},
		});


		entity.save().then(function(){
			console.log('saved entity', entity.id);			
		});

	});

	lyer2.save().then(function(){
		console.log('saved layer "test layer"', lyer2.id);

		var entity = new store.Entity({
			layer_id : lyer2.id,
			properties:{
				_main: 'une deuxieme entite qui dechire sa mere 1'
			},
			geometry: {
	        "type": "LineString",
		        "coordinates": [
		          [52.0, 0.0], [53.0, 1.0], [54.0, 0.0], [55.0, 1.0]
		        ],
			},
		});


		entity.save().then(function(){
			console.log('saved entity', entity.id);			
		});

	});
});




user.save().then(function(){
	console.log('saved user pierre@pierre.com', user.id);


	var lyer = new store.Layer({
		user_id: user.id,
		type:'geojson',
		properties: {
			name: 'pierre layer 1',
			description: 'This is a beautiful layer about whatever you want',
		    style: {
		    	color:"#EA002A",
		    },
		}
	});

	var lyer2 = new store.Layer({
		user_id: user.id,
		type:'geojson',
		properties: {
			name: 'pierre layer 2'
		}
	});

	// var lyer3 = new store.Layer({
	// 	user_id: user.id,
	// 	type:'wms',
	// 	properties: {
	// 		name: 'A WMS Layer',
	// 		url: 'http://130.104.1.182:6080/arcgis/services/atlas_brabantSZenne_hydrographie_TESTWMS/MapServer/WmsServer',
 //            options:{
 //                layers: '1',
 //                format: 'image/png',
 //                transparent: true,
 //                attribution: "OpenStreetMap styled by Speculoos",
 //                // crs: 'EPSG:4326'
 //            }
	// 	}
	// });

	// lyer3.save().then(function(){});

	// // 	var lyer3 = new store.Layer({
	// // 	user_id: user.id,
	// // 	type:'wms',
	// // 	properties: {
	// // 		name: 'bMa',
	// // 		url: 'http://bmawms.specgis.be/service',
 // //            options:{
 // //                layers: 'bMa',
 // //                format: 'image/png',
 // //                transparent: true,
 // //                attribution: "OpenStreetMap styled by Speculoos",
 // //                crs: 'EPSG900913'
 // //            }
	// // 	}
	// // });

	// lyer3.save().then(function(){});

	lyer.save().then(function(){
		console.log('saved layer "test layer"', lyer.id);

		var entity = new store.Entity({
			layer_id : lyer.id,
			properties:{
				_main: 'une entite qui dechire sa mere',
			},
			geometry: {
		        "type": "LineString",
		        "coordinates": [
		          [52.0, 0.0], [53.0, 1.0], [54.0, 0.0], [55.0, 1.0]
		        ],
		    },
		});


		entity.save().then(function(){
			console.log('saved entity', entity.id);			
		});

	});

	lyer2.save().then(function(){
		console.log('saved layer "test layer"', lyer2.id);

		var entity = new store.Entity({
			layer_id : lyer2.id,
			properties:{
				_main: 'une deuxieme entite qui dechire sa mere'
			},
			geometry: {
		        "type": "LineString",
		        "coordinates": [
		          [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
		        ]
		    },
		});


		entity.save().then(function(){
			console.log('saved entity', entity.id);			
		});

	});

	var grp = new store.Group({
		properties: {
			name: 'A Map',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		}
	});

	grp.save().then(function(){
		grp.layers().attach(sublayer);
		grp.layers().attach(sublayer2);
		grp.users().attach(user);
	});	

	var grp2 = new store.Group({
		properties: {
			name: 'ANother Map',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		}
	});

	grp2.save().then(function(){
		grp2.layers().attach(sublayer);
		grp2.layers().attach(sublayer2);
		// grp2.users().attach(user);
	});
});

