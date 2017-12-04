create schema `fuzion-admin-api`;

use `fuzion-admin-api`;

create table `show` (
	`pk_id` int not null auto_increment,
	`show_id` binary(16) not null,
	`name` varchar(50) not null,
	`description` varchar(500),
	`active` tinyint not null default 0,
	primary key (`pk_id`)
);

DELIMITER //
CREATE DEFINER=`root`@`localhost` 
FUNCTION ordered_uuid(uuid BINARY(36))
RETURNS binary(16) DETERMINISTIC
BEGIN
RETURN UNHEX(CONCAT(SUBSTR(uuid, 15, 4),SUBSTR(uuid, 10, 4),SUBSTR(uuid, 1, 8),SUBSTR(uuid, 20, 4),SUBSTR(uuid, 25)));
END//
DELIMITER ;

insert into `show` (
	`show_id`,
	`name`,
	`description`,
	`active`
)
values
	(ordered_uuid(uuid()), 'Test Show Uno', 'This is only a test...', 1),
	(ordered_uuid(uuid()), 'Test Show Dos', 'This is also a test...', 1),
	(ordered_uuid(uuid()), 'Test Show Tres', 'As is this one...', 1),
	(ordered_uuid(uuid()), 'Test Show Cuatro', 'You might have guessed by now.', 1);

select hex(`show_id`) from `show`;