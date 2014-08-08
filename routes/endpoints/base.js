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



module.exports.RequestHandler = object.Object.extend({

	pageSize: 32,

	_offset: function(page){
		page = page || 0;
		return page * this.pageSize;
	},

	_applyWhere: function(qb,w){
	    if(_.isArray(w)){
	        qb.where.apply(qb, w);
	    }
	    else{
	        qb.where(w);
	    }
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

	_get: function(id){
		var D = deferred();
		var self = this;
		this.model.where({id:id})
			.fetch()
			.then(function(model){
				if(model){
					D.resolve(self._filterResult(model.toJSON()));
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
				self._applyWhere(Q, w);
			});
		}
	},

	_list: function(options){
		var self = this;
		var D = deferred();
		var Q = self.model.query();
		
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
	            results = _.map(res, function(attrs){
	            	var m = new self.model(parse(attrs));
	            	return m.toJSON();
	            });
	            var result = {
	                page: options.page || 0,
	                count: count,
	                numPages: Math.ceil(count / self.pageSize),
	                results: res,
	            };
	            return D.resolve(result);
	        });
	    });

		return D.promise;
	},

	_post: function(attributes){
		var D = deferred();
		var model = new this.model(attributes);
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
		var attrs = req.body;
		this._post(attrs)
			.done(function(m){
				res.json(201, m);
		}, function(err){
			res.json(500, err);
		});
	},

	put: function(req, res){
		var attrs = req.body;
		attrs.id = req.params.id;
		this._post(attrs)
			.done(function(m){
				res.json(201, m);
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

