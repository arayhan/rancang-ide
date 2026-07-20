CREATE TYPE "public"."generation_stage" AS ENUM('validation', 'structure', 'prd', 'tasks');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('strong', 'weak', 'pivot');--> statement-breakpoint
CREATE TABLE "generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"project_id" uuid,
	"stage" "generation_stage" NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "generations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "validations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"verdict" "verdict" NOT NULL,
	"report" jsonb NOT NULL,
	"model_used" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "validations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validations" ADD CONSTRAINT "validations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "generations_user_id_idx" ON "generations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "validations_project_id_idx" ON "validations" USING btree ("project_id");--> statement-breakpoint
CREATE POLICY "generations_select_own" ON "generations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "generations"."user_id");--> statement-breakpoint
CREATE POLICY "generations_insert_own" ON "generations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "generations"."user_id");--> statement-breakpoint
CREATE POLICY "validations_select_own" ON "validations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "projects" where "projects"."id" = "validations"."project_id" and "projects"."user_id" = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "validations_insert_own" ON "validations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (select 1 from "projects" where "projects"."id" = "validations"."project_id" and "projects"."user_id" = (select auth.uid())));