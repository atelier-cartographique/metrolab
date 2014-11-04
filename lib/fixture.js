	

var store = require('./store');



var user = new store.User({
	name:'metrolab@metrolab.com',
	password: 'plokplok'
});


var user2 = new store.User({
	name:'user2@user2.com',
	password: 'plokplok'
});

var sublayer, sublayer2;

user2.save().then(function(){
	console.log('user user2@user2.com', user2.id);

	var grp = new store.Group({
		status_flag: 2,
		user_id: user2.id,
		properties: {
			name: 'workspace',
			description: 'personal workspace',
		}
	});


	var lyer = new store.Layer({
		user_id: user2.id,
		type:'geojson',
		properties: {
			name: 'user2 layer 1',
			description: 'This is a beautiful layer about whatever you want',
		}
	});

	var lyer2 = new store.Layer({
		user_id: user2.id,
		type:'geojson',
		properties: {
			name: 'user2 layer 2',
			description: 'This is another beautiful layer about whatever you want',
		}
	});



	sublayer = lyer;
	sublayer2 = lyer2;

	lyer.save().then(function(){
		console.log('\tlayer', lyer.get('properties').name, lyer.id);

		var entity = new store.Entity({
			layer_id : lyer.id,
			user_id: user2.id,
			properties:{
				_main: 'un premier élément'
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
			console.log('\t\tentity', entity.id);	
		});

		lyer2.save().then(function(){
		console.log('\tlayer', lyer2.get('properties').name, lyer2.id);

			var entity = new store.Entity({
				layer_id : lyer2.id,
				user_id: user2.id,
				properties:{
					_main: 'un deuxième élément'
				},
				geometry: {
		        "type": "LineString",
			        "coordinates": [
			          [52.0, 0.0], [53.0, 1.0], [54.0, 0.0], [55.0, 1.0]
			        ],
				},
			});


			entity.save().then(function(){
				console.log('\t\tentity', entity.id);			
			});

			grp.save().then(function(){
				console.log('\t\t\tgroup', grp.id);	
				grp.layers().attach(lyer);
				grp.layers().attach(lyer2);
			});	
		});
	});




});




user.save().then(function(){
	console.log('saved user metrolab@metrolab.com', user.id);

	var grp = new store.Group({
		status_flag: 2,
		user_id: user.id,
		properties: {
			name: 'workspace',
			description: 'personal workspace',
		}
	});

	var grp2 = new store.Group({
		status_flag: 0,
		user_id: user.id,
		properties: {
			name: 'Another Map',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		}
	});

	var lyer = new store.Layer({
		user_id: user.id,
		type:'geojson',
		properties: {
			name: 'metrolab layer 1',
			description: 'This is a layer about whatever you want',
		    style: {
		    	color:"#EA002A",
		    },
		}
	});

	var lyer2 = new store.Layer({
		user_id: user.id,
		type:'geojson',
		properties: {
			name: 'metrolab layer 2'
		}
	});

	lyer.save().then(function(){
		console.log('saved layer "test layer"', lyer.id);

		var entity = new store.Entity({
			layer_id : lyer.id,
			user_id: user.id,

			properties:{
				_main: 'une entite',
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

		
		lyer2.save().then(function(){
			console.log('saved layer "test layer"', lyer2.id);

			var entity = new store.Entity({
				layer_id : lyer2.id,
				user_id: user.id,
				properties:{
					_main: 'une deuxieme entite'
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

			grp.save().then(function(){
				grp.layers().attach(lyer);
				grp.layers().attach(lyer2);
				// grp.users().attach(user);


				grp2.save().then(function(){
					grp2.layers().attach(sublayer);
					grp2.layers().attach(sublayer2);
					grp2.users().attach(user);
				});
				
			});	


		});

	});



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
