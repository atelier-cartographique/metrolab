/*
 * collections.js
 *
 *
 * Copyright (C) 2013  Pierre Marchand <pierremarc07@gmail.com>, Gijs de Heij <gijs@de-heij.com>
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

/**

*/

define(['core/dataTypes'],
function(DT)
{

    var Collection = DT.Collection.extend({
        constructor: function () {
            DT.Collection.apply(this, [arguments]);
            console.warn('Collections.Collection is deprecated. Please instantiate a new Collection through DataTypes');
        }
    });

    /**
    * Collection-prototypes container
    */
    var C = {};


    var collections = {}
    
    for(var c in C)
    {
        collections[c] = new C[c];
    }

    collections.Collection = Collection;

    return collections;
});