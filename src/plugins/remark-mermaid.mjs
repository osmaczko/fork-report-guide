// A ```mermaid fence becomes <pre class="mermaid"> before Expressive Code sees it as code.
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function remarkMermaid() {
  const walk = (node) => {
    node.children?.forEach((child, i) => {
      if (child.type === "code" && child.lang === "mermaid") {
        node.children[i] = { type: "html", value: `<pre class="mermaid">${escape(child.value)}</pre>` };
      } else {
        walk(child);
      }
    });
  };
  return walk;
}
