CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"googleId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"bio" text,
	"refreshToken" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
