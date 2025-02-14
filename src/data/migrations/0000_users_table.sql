CREATE TABLE "users" (
	"discord_id" bigint PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
