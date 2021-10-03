import { NodeType, MarkDownNode } from './Types';
// Renderer
const render = (nodes: MarkDownNode[], entry = true): string => {
  let content = '';
  // Render
  if (entry) content += `${'='.repeat(process.stdout.columns)}\n`;
  nodes.forEach((node) => {
    const nodeContent = Array.isArray(node.content) ? render(node.content, false) : node.content;
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
      // TODO: Figure out why the blockqoute backgroundis not working properly
      case NodeType.BlockQuote:
        content += `\x1b[46m ${nodeContent}\x1b[0m`;
        break;
      // Normal Text
      case NodeType.Text:
        content += nodeContent;
        break;
      // Debug
      default:
        console.log(`Implement rendering for Node Typ ${node.type}`)
    }
    content += '\x1b[0m';
  });
  if (entry) content += `\n${'='.repeat(process.stdout.columns)}\x1b[0m`;
  // Return
  return content;
}
export default render;