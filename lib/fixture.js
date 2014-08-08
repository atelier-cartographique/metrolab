

var store = require('./store');



var user = new store.User({
	name:'pierre@pierre.com',
	password: 'plokplok'
});

user.save().then(function(){
	console.log('saved user pierre@pierre.com', user.id);


	var lyer = new store.Layer({
		user_id: user.id,
		properties: {
			name: 'test layer'
		}
	});

	var lyer2 = new store.Layer({
		user_id: user.id,
		properties: {
			name: 'test layer 2'
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
		          [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
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
});

