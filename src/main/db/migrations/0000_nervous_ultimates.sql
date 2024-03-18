CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`name` text,
	`type` integer,
	`status` text DEFAULT 'init',
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
