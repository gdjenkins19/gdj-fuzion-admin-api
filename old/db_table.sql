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
