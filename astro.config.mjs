import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import remarkMermaid from "./src/plugins/remark-mermaid.mjs";

// SITE and BASE come from the deploy: GitHub Pages serves a project site under /<repo>/.
export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE ?? "/",
  markdown: { remarkPlugins: [remarkMermaid] },
  integrations: [
    starlight({
      title: "Fork report",
      description: "Whether the members of a logos-chat group still hold one group: how it works, how to run it, how to read it.",
      social: [{ icon: "github", label: "logos-chat", href: "https://github.com/logos-messaging/logos-chat" }],
      components: { MarkdownContent: "./src/components/MarkdownContent.astro" },
      expressiveCode: { defaultProps: { wrap: true } },
      customCss: ["@fontsource-variable/inter", "./src/styles/theme.css"],
      sidebar: [
        {
          label: "Guide",
          items: [
            { label: "Introduction", link: "/" },
            { slug: "how-it-works" },
            { slug: "run-it" },
            { slug: "read-the-report" },
            { slug: "simulations" },
          ],
        },
        {
          label: "Reference",
          items: [{ slug: "reference/commands" }, { slug: "reference/records" }],
        },
      ],
    }),
  ],
});
