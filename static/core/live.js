/*
 * live.js
 *     
 * 
 * Copyright (C) 2013  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify *
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

define(['underscore', 'sockjs', 'core/auth', 'core/logger', 'config'], 
function(_, S, auth, log, config){
    
    var live = function(){
        log.debug('live.constructor');
        this._inited = false;
        this.subscribers = [];
        this._pendings = [];
        auth.notifier.on('in', this.connect, this);
    };
    
    _.extend(live.prototype, {
        
        connect: function(token){
            log.debug('live.connect');
            this._token = token;
            this._connection = new S(config.liveUrl),
            this._connection.onmessage = this._handleMessage.bind(this);
            this._connection.onopen = this.bootstrap.bind(this);
            this._inited = true;
        },
        
        bootstrap: function(){
            log.debug('live.bootstrap');
            var self = this;
            this._connection.send(JSON.stringify(this._token));
            _.each(this._pendings, function(p){
                self.subscribe(p.channel, p.callback, p.ctx);
            });
            this._pendings = [];
        },
        
        _handleMessage: function(e){
            log.debug('live._handleMessage', e);
            var data = JSON.parse(e.data);
            if(data.channel)
            {
                var rec = _.where(this.subscribers, {channel:data.channel});
                _.each(rec, function(o){
                    o.callback.apply(o.ctx, [data]);
                });
            }
        },
        
        subscribe:function(channel, callback, ctx){
            log.debug('live.subscribe', channel);
            
            var subscriber = {
                channel:channel,
                callback:callback,
                ctx:ctx,
            };
            
            if(this._inited 
                && this._connection.readyState == S.OPEN)
            {
                this._connection.send(JSON.stringify({channel:channel}));
                this.subscribers.push(subscriber);
                return this.subscribers.length;
            }
            
            this._pendings.push(subscriber);
            return this._pendings.length;
            
        },
        
    });
    
    
    return (new live);
});