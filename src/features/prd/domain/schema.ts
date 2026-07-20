import { z } from "zod";

/**
 * A PRD document: markdown body plus light metadata. The markdown is the
 * primary content (rendered + exported); this is the AI output contract too.
 */
export const prdDocumentSchema = z.object({
  title: z.string().describe("The product/PRD title."),
  summary: z.string().optional().describe("One-paragraph overview."),
  markdown: z
    .string()
    .describe(
      "The full PRD in GitHub-flavored markdown: overview, goals, features with acceptance criteria, non-goals.",
    ),
});

export type PrdDocument = z.infer<typeof prdDocumentSchema>;
