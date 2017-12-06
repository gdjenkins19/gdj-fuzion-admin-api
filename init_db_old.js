var mysql = require('mysql');

var sqlArry = [
    `create schema \`fuzion-admin-api\``,
    `create table \`show\` (
        \`pk_id\` int not null auto_increment,
        \`show_id\` binary(16) not null,
        \`name\` varchar(50) not null,
        \`description\` varchar(500),
        \`active\` tinyint not null default 0,
        primary key (\`pk_id\`)
    )`,
    `CREATE DEFINER=\`root\`@\`localhost\` 
    FUNCTION ordered_uuid(uuid BINARY(36))
    RETURNS binary(16) DETERMINISTIC
    BEGIN
    RETURN UNHEX(CONCAT(SUBSTR(uuid, 15, 4),SUBSTR(uuid, 10, 4),SUBSTR(uuid, 1, 8),SUBSTR(uuid, 20, 4),SUBSTR(uuid, 25)));
    END`,
    `insert into \`show\` (
        \`show_id\`,
        \`name\`,
        \`description\`,
        \`active\`
    )
    values
        (ordered_uuid(uuid()), 'Test Show Uno', 'This is only a test...', 1),
        (ordered_uuid(uuid()), 'Test Show Dos', 'This is also a test...', 1),
        (ordered_uuid(uuid()), 'Test Show Tres', 'As is this one...', 1),
        (ordered_uuid(uuid()), 'Test Show Cuatro', 'You might have guessed by now.', 1)`
];

var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "coffeetime",
    multipleStatements: false
});

runQueries(connection,sqlArry);

function runQueries(conn, sqlArray) {
    var sql = sqlArray.shift();

    console.log(`sql = ${sql}`);    
    conn.query(sql, function(err, results) {
        if (err) throw err;
        conn.end();
        
        if (sqlArray.length > 0) {
            var connection = mysql.createConnection({
                "host": "localhost",
                "user": "root",
                "password": "coffeetime",
                "database": "fuzion-admin-api",
                multipleStatements: false
            });
            runQueries(connection, sqlArray);
        }
    });
}
