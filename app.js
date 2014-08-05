/*
 * app.js
 *     
 * 
 * Copyright (C) 2014  Pierre Marchand <pierremarc07@gmail.com>
 * 
 * License in LICENSE file at the root of the repository.
 *
 */


var config = require('./config');
require('./lib/db').configure(config.db);
var app = require('./lib/server')(config.server);


require('./routes')(app);

app.start();


