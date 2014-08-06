/*
 * logger.js
 *     
 * 
 Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 
 This program is free software: you can redistribute it and/or modify *
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




define([], function(){
    
    // TODO please make it fancy - pm
    
    var _clog = console.log;
    console.log = function(){
        var e = '>>';
        var args = [e];
        for(var i=0; i< arguments.length;i++)
        {
            args.push(arguments[i]);
        }
        _clog.apply(console, args);
    };
    
    var logger = {
        log     : console.log,
        debug   : console.log,
        warning : console.warn,
        error   : console.error,
    };
    
    return logger;
});

