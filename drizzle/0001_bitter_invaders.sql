CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"method" text,
	"grinder_id" uuid,
	"dripper_id" uuid,
	"grind_clicks" integer,
	"water_temp_c" numeric(4, 1),
	"dose_g" numeric(5, 1),
	"water_g" numeric(6, 1),
	"brew_time_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brews" ADD COLUMN "is_favorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "brews" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "brews" ADD COLUMN "photo_path" text;--> statement-breakpoint
ALTER TABLE "coffee_beans" ADD COLUMN "stock_g" numeric(7, 1);--> statement-breakpoint
ALTER TABLE "coffee_beans" ADD COLUMN "photo_path" text;--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_fragrance" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_flavor" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_aftertaste" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_acidity" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_body" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_balance" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_uniformity" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_clean_cup" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_sweetness" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "tasting_notes" ADD COLUMN "sca_overall" numeric(4, 2);--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_grinder_id_equipment_id_fk" FOREIGN KEY ("grinder_id") REFERENCES "public"."equipment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_dripper_id_equipment_id_fk" FOREIGN KEY ("dripper_id") REFERENCES "public"."equipment"("id") ON DELETE set null ON UPDATE no action;