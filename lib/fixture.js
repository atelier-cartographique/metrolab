

var store = require('./store');



var user = new store.User({
	name:'pierre@pierre.com',
	password: 'plokplok'
});


var user2 = new store.User({
	name:'plok@plok.com',
	password: 'plokplok'
});

var sublayer;

user2.save().then(function(){
	console.log('saved user plok@pierre.com', user2.id);


	var lyer = new store.Layer({
		user_id: user2.id,
		properties: {
			name: 'plok layer 1'
		}
	});

	var lyer2 = new store.Layer({
		user_id: user2.id,
		properties: {
			name: 'plok layer 2'
		}
	});

	sublayer = lyer;

	lyer.save().then(function(){
		console.log('saved layer "test layer"', lyer.id);

		var entity = new store.Entity({
			layer_id : lyer.id,
			properties:{
				yyXX: 'une entite qui dechire sa mere'
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
				yyXX: 'une deuxieme entite qui dechire sa mere'
			},
			geometry: {
			    "type": "Point",
			    "coordinates": [
			        -105.01621,
			        59.57422
			    ]
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
		properties: {
			name: 'pierre layer 1'
		}
	});

	var lyer2 = new store.Layer({
		user_id: user.id,
		properties: {
			name: 'pierre layer 2'
		}
	});


	lyer.save().then(function(){
		console.log('saved layer "test layer"', lyer.id);

		var entity = new store.Entity({
			layer_id : lyer.id,
			properties:{
				yyXX: 'une entite qui dechire sa mere'
			},
			geometry: {
		        "type": "LineString",
		        "coordinates": [
		          [52.0, 0.0], [53.0, 1.0], [54.0, 0.0], [55.0, 1.0]
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
				yyXX: 'une deuxieme entite qui dechire sa mere'
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
			name: 'A Map'
		}
	});

	grp.save().then(function(){
		grp.layers().attach(sublayer);
		grp.users().attach(user);
	});
});

