CREATE TABLE `transcrptions` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`name` text,
	`type` text,
	`status` text DEFAULT 'init',
	`timestamp` integer NOT NULL
);
