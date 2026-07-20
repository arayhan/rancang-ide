CREATE TYPE "public"."document_type" AS ENUM('tree', 'prd', 'tasks');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"content" jsonb NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"model_used" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "documents_project_type_idx" ON "documents" USING btree ("project_id","type");--> statement-breakpoint
CREATE POLICY "documents_select_own" ON "documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (select 1 from "projects" where "projects"."id" = "documents"."project_id" and "projects"."user_id" = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "documents_insert_own" ON "documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (select 1 from "projects" where "projects"."id" = "documents"."project_id" and "projects"."user_id" = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "documents_update_own" ON "documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (select 1 from "projects" where "projects"."id" = "documents"."project_id" and "projects"."user_id" = (select auth.uid()))) WITH CHECK (exists (select 1 from "projects" where "projects"."id" = "documents"."project_id" and "projects"."user_id" = (select auth.uid())));