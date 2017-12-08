var argv = require('optimist')
    .usage('Usage: $0 -host [mysql_hostname] -user [mysql_user] -password [mysql_paswword] -file [sql file path]')
    .demand(['host','user','password','file'])
    .argv;

//Get the SQL File as an array of strings and no empty lines
var fs = require("fs");
var text = fs.readFileSync(argv.file).toString();
var lines = text.split("\n");

lines = lines.filter(line => line.length > 0); //remove empty lines
lines = lines.filter(line => line.search(/^\s*\-\-/) === -1); //remove comments
lines = lines.map(x => x.replace(/\-\-.*/,''));

//Convert Array of lines into an array of SQL Statements
//State machine
var state = 0;
var curr = '';
var sep = '';
var sqlArry = [];

lines.forEach(function(line) {
    //console.log(`l: ${line}`);
  switch (state) {
    case 0:
      //Beginning of a new SQL statement
      if (line.search(/DELIMITER/) > -1) {
        //Ignoring the first line since don't need the DELIMITER when running single statements
        state = 2;
      } else {
        curr = curr + sep + line;
        sep = " ";
        state = line.search(/\;/) === -1 ? 1 : 0;
      }
      break;
    case 1:
      //Building Regular Statemnt
      curr = curr + sep + line;
      state = line.search(/\;/) === -1 ? 1 : 0;
      break;
    case 2:
      //Building Delimiter|Create|Function
      curr = curr + sep + line;
      sep = " ";
      if (line.search(/END/) > -1) {
        curr = curr.replace(/END.*$/, "END");
        state = 3;
      }
      break;
    case 3:
      //Ignoring after 'END' in Delimiter|Create|Function
      state = line.search(/DELIMITER/) > -1 ? 0 : 3;
      break;
  }
  //If state has been set to 0, then go ahead and reset and save SQL statement that has been created
  if (state === 0) {
    sqlArry.push(curr);
    curr = "";
    sep = "";
  }
});

//sqlArry.forEach(function (stmt){console.log(`stmt -> ${stmt}`)});

// Now let's send the sql to the mysql server

var mysql = require('mysql');

var connection_params = {
    host: argv.host,
    user: argv.user,
    password: argv.password,
    multipleStatements: false
};

runQueries(connection_params,sqlArry,1);

// SQL file should start with a create schema command (no database in params!)
// SQL should include a 'use `database_name`;' command, we use it to set the database in params later
function runQueries(params, sqlArray, cnt) {
    var sql = sqlArray.shift();
    console.log(`q(${cnt}): ${sql}`);

    var db = sql.match(/USE \`(.+)\`\;/i);

    if (!db) {
        db = sql.match(/^USE (.+)\;/i);
    }

    if (db) {
        params.database = db[1];
    } 

    var conn = mysql.createConnection(params);

    conn.query(sql, function(err, results) {
        if (err) throw err;
        conn.end();
        
        if (sqlArray.length > 0) {
            runQueries(params, sqlArray, cnt+1);
        }
    });
}
