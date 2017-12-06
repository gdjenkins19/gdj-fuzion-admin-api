var argv = require('optimist')
    .usage('Usage: $0 -host [mysql_hostname] -user [mysql_user] -password [mysql_paswword] -file [absolute sql file path]')
    .demand(['host','user','password','file'])
    .argv;

var mysql = require('mysql');
var fs = require("fs");

var connection_params = {
    host: argv.host,
    user: argv.user,
    password: argv.password,
    multipleStatements: false
};

var text = fs.readFileSync(argv.file).toString();
var lines = text.split("\n");

lines = lines.filter(line => line.length > 0);

var state = 0;
var curr = '';
var sep = '';
var sqlArry = [];

lines.forEach(function (line) {
    switch (state) {
        case 0:
            if (line.search(/DELIMITER/) > -1) {
                state = 2;
            } else {
                curr = curr + sep + line;
                sep = ' ';
                state = line.search(/\;/) === -1 ? 1 : 0;
            }
            break;
        case 1:
            curr = curr + sep + line;
            state = (line.search(/\;/) === -1) ? 1 : 0;
            break;
        case 2:
            curr = curr + sep + line;
            sep = ' ';
            if (line.search(/END/) > -1) {
                curr = curr.replace(/END.*$/,'END');
                state = 3;
            }
            break;
        case 3:
            state = (line.search(/DELIMITER/) > -1) ? 0 : 3;
            break;
    }
    if (state === 0) {
        sqlArry.push(curr);
        curr = '';
        sep = '';
    }
});

if (curr.length > 0) {
    groups.push(curr);
}

sqlArry.forEach(function (item) {
    console.log('SQL -> ' + item);
});


runQueries(connection_params,sqlArry);

function runQueries(params, sqlArray) {
    var sql = sqlArray.shift();

    console.log(`sql = ${sql}`);

    var db = sql.match(/use \`(.+)\`\;/);
    if (db) {
        params.database = db[1];
    } 

    var conn = mysql.createConnection(params);

    conn.query(sql, function(err, results) {
        if (err) throw err;
        conn.end();
        
        if (sqlArray.length > 0) {
            runQueries(params, sqlArray);
        }
    });
}
