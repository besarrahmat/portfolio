CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`issued_at` text NOT NULL,
	`expires_at` text,
	`credential_id` text,
	`url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`institution` text NOT NULL,
	`degree` text NOT NULL,
	`field` text NOT NULL,
	`start` text NOT NULL,
	`end` text,
	`grade` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`employment_type` text NOT NULL,
	`location` text NOT NULL,
	`work_mode` text NOT NULL,
	`start` text NOT NULL,
	`end` text,
	`summary` text NOT NULL,
	`highlights` text NOT NULL,
	`skills` text NOT NULL,
	`disclosure` text NOT NULL,
	`counts_toward_experience` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `experiences_status_sort` ON `experiences` (`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`name` text NOT NULL,
	`short_name` text NOT NULL,
	`alternate_names` text NOT NULL,
	`headline` text NOT NULL,
	`tagline` text NOT NULL,
	`location` text NOT NULL,
	`summary` text NOT NULL,
	`avatar_key` text,
	`cv_key` text,
	`contact_email` text,
	`links` text NOT NULL,
	`languages` text NOT NULL,
	`availability` text,
	`updated_at` integer NOT NULL,
	CONSTRAINT "profile_singleton" CHECK("profile"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `project_media` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`alt` text NOT NULL,
	`kind` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_media_project_sort` ON `project_media` (`project_id`,`sort_order`);--> statement-breakpoint
CREATE TABLE `project_skills` (
	`project_id` text NOT NULL,
	`skill_id` text NOT NULL,
	PRIMARY KEY(`project_id`, `skill_id`),
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `project_skills_skill` ON `project_skills` (`skill_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text NOT NULL,
	`summary` text NOT NULL,
	`role` text NOT NULL,
	`experience_id` text,
	`period_start` text NOT NULL,
	`period_end` text,
	`kind` text NOT NULL,
	`links` text NOT NULL,
	`state` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`case_study` text,
	`metrics` text NOT NULL,
	`architecture` text,
	`cover_key` text,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`experience_id`) REFERENCES `experiences`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_status_sort` ON `projects` (`status`,`sort_order`);--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`icon` text,
	`main` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slug_redirects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`old_slug` text NOT NULL,
	`new_slug` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_redirects_oldSlug_unique` ON `slug_redirects` (`old_slug`);