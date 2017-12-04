// var execsql = require('execsql');
// var sqlFile = "/Users/gdjenkins19/Sites/fuzion/gdj-fuzion-admin-api/old/test_ordered_uuid.sql";
// var config = {
//     "host": "localhost",
//     "user": "root",
//     "password": "coffeetime"
// };

// execsql.config(config).execFile(sqlFile, function(err, results){
//     console.log(results);
// }).end();



var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "coffeetime",
    multipleStatements: true
});

var fs = require("fs");
var sql;

fs.readFile("./old/test_ordered_uuid.sql", "UTF8", function(err, sql) {
    if (err) { throw err };
    console.log(sql);

    connection.query(sql, function(err, results) {
        if (err) throw err;
      
        // `results` is an array with one element for every statement in the query:
        console.log(results[0]); // [create1]
        console.log(results[1]); // [create2]
        console.log(results[2]); // [select3]
    });
});

// = "create schema `fuzion-admin-api`; \
// use `fuzion-admin-api`; \
// DELIMITER // \
// CREATE DEFINER=`root`@`localhost` FUNCTION `ordered_uuid`(uuid BINARY(36)) \
// RETURNS binary(16) DETERMINISTIC \
// RETURN UNHEX(CONCAT(SUBSTR(uuid, 15, 4),SUBSTR(uuid, 10, 4),SUBSTR(uuid, 1, 8),SUBSTR(uuid, 20, 4),SUBSTR(uuid, 25))); \
// // \
// DELIMITER ; \
// create table `show` ( \
// 	`pk_id` int not null auto_increment, \
// 	`show_id` binary(16) not null, \
// 	`name` varchar(50) not null, \
// 	`description` varchar(500), \
// 	`active` tinyint not null default 0, \
// 	primary key (`pk_id`) \
// ); \
// insert into `show` ( \
// 	`show_id`, \
// 	`name`, \
// 	`description`, \
// 	`active` \
// ) \
// values \
// 	(ordered_uuid(uuid()), 'Test Show Uno', 'This is only a test...', 1), \
// 	(ordered_uuid(uuid()), 'Test Show Dos', 'This is also a test...', 1), \
// 	(ordered_uuid(uuid()), 'Test Show Tres', 'As is this one...', 1), \
// 	(ordered_uuid(uuid()), 'Test Show Cuatro', 'You might have guessed by now.', 1); \
// select hex(`show_id`) from `show`;";


  