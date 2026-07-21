import { z } from "zod";

/** A generic generated markdown document (BRD, DB design, system design). */
export const markdownDocSchema = z.object({
  title: z.string().describe("The document title."),
  markdown: z
    .string()
    .describe("The full document body in GitHub-flavored markdown."),
});

export type MarkdownDoc = z.infer<typeof markdownDocSchema>;
