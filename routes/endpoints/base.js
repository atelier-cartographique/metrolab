/*
 * routes/endpoints/base.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */


var _ = require('underscore'),
	deferred = require('deferred');

var store = require('../../lib/store'),
	object = require('../../lib/object');


var Where = object.Object.extend({
	initialize: function(col, op, val){
		this.col = col;
		this.op = op;
		this.val = val;
	},

	use: function(Q){
		if('function' === (typeof this.col)){
			this.col.apply(this.op, [Q]);
		}
		else{
			Q.where(this.col, this.op, this.val);
		}
	}
});
module.exports.Where = Where;
module.exports.where = function(c, o , v){
	return new Where(c,o,v);
};


module.exports.RequestHandler = object.Object.extend({

	pageSize: 32,
	modelName: '',
	model: object.Object,

	_offset: function(page){
		page = page || 0;
		return page * this.pageSize;
	},


	_filterResult: function(res){
		return this.tryMethod('filterResult', res, res);
	},

	_filterResultList: function(res){
		var self = this;
		var fres = [];
		_.each(res, function(r){
			fres.push(self._filterResult(r));
		});
		return fres;
	},

	_get: function(id, keepAlive){
		var D = deferred();
		var self = this;
		var related = _.result(self, 'related');
		var fetchOptions = {};
		if(related){
			fetchOptions.withRelated = related;
		}
		this.model.where({id:id})
			.fetch(fetchOptions)
			.then(function(model){
				if(model){
					if(keepAlive){
						D.resolve(model);
					}
					else{
						D.resolve(self._filterResult(model.toJSON()));
					}
				}
				else{
					D.reject('NotFound');
				}
			});
		return D.promise;
	},

	_parseWhere:function(Q, options){
		var self = this;
		if('where' in options){
			var wheres = options.where;
			if(!_.isArray(wheres)){
				wheres = [wheres];
			}
			_.each(wheres, function(w){
				w.use(Q);
			});
		}
	},

	_list: function(options){
		var self = this;
		var D = deferred();
		var Q = self.model.query();
		var related = _.result(self, 'related');
		
		self._parseWhere(Q, options);
		
// FIXME
		var parserModel = new self.model;
		var parse = _.bind(parserModel.parse, parserModel);

		Q.count('id')
		 .exec(function(err, c){
	        if(err){ return D.reject(err); }
	        var count = parseInt(c[0].count);
	        var Q2 = self.model.query();

			self._parseWhere(Q2, options);

	        Q2.offset(self._offset(options.page))
	        .limit(self.pageSize)
	        .select()
	        .exec(function(err, res){
	            if(err){ return D.reject(err); }
	            res = self._filterResultList(res);

	            var result = {
	                page: options.page || 0,
	                count: count,
	                numPages: Math.ceil(count / self.pageSize),
	                results: [],
	            };
	            
	            var resolve = _.after(res.length, function(){
	            	D.resolve(result);
	            });

	            _.each(res, function(attrs){
	            	var m = new self.model(parse(attrs));
	            	if(related){
	            		m.load(related)
	            		 .then(function(model){
	            		 	result.results.push(model.toJSON());
		            		resolve();
	            		 });
	            	}
	            	else{
		            	result.results.push(m.toJSON());
		            	resolve();	
	            	}
	            });
	   
	        });
	    });

		return D.promise;
	},

	_post: function(attributes){
		var D = deferred();
		var model = new this.model(attributes, {parse: true});
		var self = this;
		model.save()
			.then(function(m){
				if(!m){
					D.reject('SaveError');
				}
				else{
					D.resolve(self._filterResult(m.toJSON()));
				}
			});
		return D.promise;

	},

	_put: function(attributes){
		return this.post(attributes);
	},

	queryError: function(res){
		return _.bind(function(err){
			res.json(500, err);
		}, this);
	},

	get: function(req, res){
		this._get(req.params.id)
			.done(function(model){
				res.json(model);
			}, function(err){
				res.json(404, err);
			});
	},

	list: function(req, res){
		var options = {};
		if('listOptions' in this 
			&& _.isFunction(this.listOptions)){
			_.extend(options, this.listOptions(req));
		}
		options.page = req.query.page;
		this._list(options)
			.done(function(result){
				res.json(result);
			}, function(err){
				res.json(500, err);
			});
	},

	post: function(req, res){
		var self = this;
		var attrs = req.body;
		this._post(attrs)
			.done(function(m){

				res.json(201, m);
				self.emit('post:' + self.modelName, m);

		}, function(err){
			res.json(500, err);
		});
	},

	put: function(req, res){
		var self = this;
		var attrs = req.body;
		attrs.id = req.params.id;
		this._post(attrs)
			.done(function(m){
				res.json(201, m);
				self.emit('put:' + self.modelName, attrs);
		}, function(err){
			res.json(500, err);
		});
	},

	defaultEndpoints: function(){
		var endpoints = {
			get:{
				verb: 'get',
				handler: 'get',
				url: this.modelName + '/:id'
			},
			list:{
				verb:'get',
				handler: 'list',
				url: this.modelName + '/'
			},
			post:{
				verb:'post',
				handler: 'post',
				url: this.modelName + '/'
			},
			put:{
				verb:'put',
				handler: 'put',
				url: this.modelName + '/:id'
			}
		};

		return endpoints;
	},

	getEndpoints: function(withDefault){
		var endpoints = {};
		var declaredEndpoints = _.result(this, 'endpoints');
		_.extend(endpoints, declaredEndpoints);

		if(withDefault){
			_.extend(endpoints, this.defaultEndpoints());
		}
		return endpoints;
	},

});


