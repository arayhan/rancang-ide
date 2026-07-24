import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Markdown } from "../markdown";

const render = (md: string) => renderToStaticMarkup(<Markdown>{md}</Markdown>);

// Verbatim shape of a risk matrix the model produced, which previously leaked
// through as literal pipes because the renderer was CommonMark-only.
const RISK_TABLE = `| Risk | Dampak | Mitigasi |
|------|--------|----------|
| **AI prompt menghasilkan konten tidak relevan atau sensitif** | Reputasi buruk, pelanggaran norma | Gunakan sistem pencarian kata kasar pada output AI. |
| **Latency WebSocket tinggi saat banyak host** | Pengalaman buzzer tidak adil | Gunakan Edge Functions Supabase terdekat (Singapore). |`;

describe("Markdown", () => {
  it("renders a GFM pipe table as a real table, not literal pipes", () => {
    const html = render(RISK_TABLE);

    expect(html).toContain("<table");
    expect(html).toContain("<thead");
    expect(html).toContain("<tbody");

    // Header cells, not body cells.
    expect(html).toMatch(/<th[^>]*>Risk<\/th>/);
    expect(html).toMatch(/<th[^>]*>Dampak<\/th>/);
    expect(html).toMatch(/<th[^>]*>Mitigasi<\/th>/);

    // Two data rows, each with three cells.
    expect(html.match(/<tr/g)).toHaveLength(3); // header + 2 body rows
    expect(html.match(/<td/g)).toHaveLength(6);

    // The regression itself: no delimiter row or stray pipes survive as text.
    expect(html).not.toContain("|---");
    expect(html).not.toContain("| Risk |");
  });

  it("wraps tables so wide columns scroll instead of breaking the layout", () => {
    const html = render(RISK_TABLE);
    expect(html).toContain("overflow-x-auto");
    // Scroll containers clip on paper — the wrapper opts out when printing.
    expect(html).toContain("print:overflow-visible");
  });

  it("renders GFM task lists as checkboxes", () => {
    const html = render("- [x] Sudah selesai\n- [ ] Belum selesai");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("checked");
    expect(html).not.toContain("[x]");
  });

  it("still renders ordinary markdown", () => {
    const html = render("# Judul\n\nHalo **dunia**.");
    expect(html).toMatch(/<h1[^>]*>Judul<\/h1>/);
    expect(html).toContain("<strong>dunia</strong>");
  });

  it("does not pass raw HTML through", () => {
    const html = render("Halo <script>alert(1)</script> dunia");
    expect(html).not.toContain("<script>");
  });
});
