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
			type: 'string',
		},
		properties : {
			type:'json',
		}
	},

	entities: {
		user_id : {
			type: 'integer',
			foreign: ['id', 'users']
		},
		layer_id : {
			type: 'integer',
			foreign: ['id', 'layers']
		},
		properties : {
			type:'json',
		}
	},

	layers: {
		properties : {
			type:'json',
		}
	},

	groups: {
		properties : {
			type:'json',
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
