CREATE TABLE `transcrptions` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`name` text,
	`type` text,
	`status` text DEFAULT 'init',
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
DROP TABLE `tasks`;