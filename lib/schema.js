/*
 * lib/schema.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */


module.exports = exports = {
	
	users : {
		name : {
			type: ['string', 124],
		},
		
		password : {
			type: ['string', 124],
		},

		properties : {
			type:'json',
		}
	},

	layers: {
		user_id : {
			type: 'integer',
			foreign: ['id', 'users']
		},

		properties : {
			type:'json',
		}
	},

	groups: {
		properties : {
			type:'json',
		}
	},


	entities: {

		layer_id : {
			type: 'integer',
			foreign: ['id', 'layers']
		},

		properties : {
			type:'json',
		},

		geometry: {
			type: 'text',
		}
	},
	
	subscriptions: {
		user_id : {
			type: 'integer',
			foreign: ['id', 'users']
		},
		group_id : {
			type: 'integer',
			foreign: ['id', 'groups']
		},
	},

	compositions: {
		layer_id : {
			type: 'integer',
			foreign: ['id', 'layers']
		},
		group_id : {
			type: 'integer',
			foreign: ['id', 'groups']
		},
	}
};
