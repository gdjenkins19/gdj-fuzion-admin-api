use `fuzion-admin-api`;

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
