import { NodeType, MarkDownNode } from './Types';
// Renderer
const _render = (input: string | MarkDownNode[]): string => Array.isArray(input) ? render(input, false) : input;
const render = (nodes: MarkDownNode[], entry = true): string => {
  let content = '';
  // Render
  if (entry) content += `${'='.repeat(process.stdout.columns)}\n`;
  nodes.forEach((node) => {
    const nodeContent = _render(node.content);
    // TODO: add a background color
    if (node.type != NodeType.BlockQuote) content += '\x1b[48;2;3;38;44m';
    switch (node.type) {
      // Headings
      // Special Text
      case NodeType.Bold:
        content += `\x1b[1m${nodeContent}\x1b[22m`;
        break;
      case NodeType.Italic:
        content += `\x1b[3m${nodeContent}\x1b[23m`;
        break;
      // Features
      case NodeType.BlockQuote:
        content += `\x1b[46m ${nodeContent}\x1b[0m`;
        break;
      // TODO: Lists
      // TODO: Code
      case NodeType.HorizontalRule:
        content += '─'.repeat(process.stdout.columns);
        break;
      case NodeType.Link:
        content += `\x1b]8;;${node.metadata?.Link || ''}\x1b\\${nodeContent}\x1b]8;;\x1b\\`;
        break;
      // Normal Text
      case NodeType.Text:
        content += nodeContent;
        break;
      // Debug
      default:
        console.log(`Implement rendering for Node Typ ${node.type} `)
    }
    content += '\x1b[0m';
  });
  if (entry) content += `\n${'='.repeat(process.stdout.columns)} \x1b[0m`;
  // TODO: fix background coloring so it is consistent
  // Return
  return content;
}
export default render;