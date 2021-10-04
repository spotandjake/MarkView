import { NodeType, MarkDownNode } from './Types';
// Renderer
const _render = (input: string | MarkDownNode[]): string => Array.isArray(input) ? render(input, false) : input;
// const line = (lineContent: string): string => `${'\x1b[48;2;3;38;44m'}${lineContent}\x1b[0m`;
const line = (lineContent: string): string => `${lineContent}\x1b[0m`;
const render = (nodes: MarkDownNode[], entry = true): string => {
  let content = '';
  let inList = NodeType.Text;
  let listIndex = 1;
  // Render
  if (entry) content += line(`${'='.repeat(process.stdout.columns)}\n`);
  nodes.forEach((node) => {
    let lineContent = '';
    const nodeContent = _render(node.content);
    switch (node.type) {
      // TODO: Headings
      case NodeType.H1:
      case NodeType.H2:
      case NodeType.H3:
      case NodeType.H4:
      case NodeType.H5:
      case NodeType.H6:
        lineContent = `${nodeContent}`;
        break;
      // Special Text
      case NodeType.Bold:
        lineContent = `\x1b[1m${nodeContent}`;
        break;
      case NodeType.Italic:
        lineContent = `\x1b[3m${nodeContent}`;
        break;
      // Features
      case NodeType.BlockQuote: //TODO: fix parsing of nested blocks
        lineContent = `\x1b[36m▋\x1b[0m${line(nodeContent)}`;
        break;
      case NodeType.OrderedList:
        if (inList != NodeType.OrderedList) listIndex = 1;
        lineContent = '  '.repeat(Math.floor(((node.metadata?.Indentation || '').split(' ').length - 1) / 2));
        lineContent += `${listIndex}) ${nodeContent.trimStart()}`;
        listIndex++;
        break;
      case NodeType.UnorderedList:
        // TODO: add list hanging indentation
        lineContent = '  '.repeat(Math.floor(((node.metadata?.Indentation || '').split(' ').length - 1) / 2));
        lineContent += `• ${nodeContent.trimStart()}`;
        break;
      case NodeType.Code:
        // TODO: syntax highlighting
        // TODO: Add a border and fix some stuff
        lineContent = `\x1b[48;2;39;40;34m${nodeContent}\x1b[0m`;
        break;
      case NodeType.SingleCode:
        lineContent = `\x1b[33m${nodeContent}\x1b[0m`;
        break;
      case NodeType.HorizontalRule:
        lineContent = '─'.repeat(process.stdout.columns);
        break;
      case NodeType.Link:
        lineContent = `\x1b]8;;${node.metadata?.Link || ''} \x1b\\${nodeContent}\x1b]8;;\x1b\\`;
        break;
      // TODO: Table
      // Normal Text
      case NodeType.Text:
        lineContent = nodeContent;
        break;
      // Debug
      default:
        console.log(`Implement rendering for Node Typ ${node.type} `);
    }
    content += line(lineContent);
    if (lineContent.trim().length != 0 && !/^([ \n]*)    /.test(lineContent)) inList = node.type;
  });
  if (entry) {
    content += line(`\n${'='.repeat(process.stdout.columns)} `);
    // TODO: fix background coloring so it is consistent
  }
  // Return
  return `${content}\x1b[0m`;
}
export default render;