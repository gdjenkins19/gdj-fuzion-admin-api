var execsql = require('execsql');
var config = require("./db_config.dev.json");
var sqlFile = "/Users/gdjenkins19/Sites/fuzion/gdj-fuzion-admin-api/node_modules/fuzion-api/lib/data/show_repository_sql.sql";

execsql.config(config.Database.create).execFile(sqlFile, function(err, results){
    console.log(results);
}).end();

