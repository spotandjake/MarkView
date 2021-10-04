import { NodeType, MarkDownNode, MarkDownLexem } from './Types';
// Regex
const Lexems: MarkDownLexem[] = [
  // Headings
  {
    type: NodeType.H1,
    regex: /^# (?<content>.*$)/im,
    renderInside: true
  },
  {
    type: NodeType.H2,
    regex: /^## (?<content>.*$)/im,
    renderInside: true
  },
  {
    type: NodeType.H3,
    regex: /^### (?<content>.*$)/im,
    renderInside: true
  },
  {
    type: NodeType.H4,
    regex: /^#### (?<content>.*$)/im,
    renderInside: true
  },
  {
    type: NodeType.H5,
    regex: /^###### (?<content>.*$)/im,
    renderInside: true
  },
  {
    type: NodeType.H6,
    regex: /^####### (?<content>.*$)/im,
    renderInside: true
  },
  // Text Formatting
  {
    type: NodeType.Bold,
    regex: /\*\*(?<content>.*)\*\*/im,
    renderInside: true
  },
  {
    type: NodeType.Bold,
    regex: /__(?<content>.*)__/im,
    renderInside: true
  },
  {
    type: NodeType.Italic,
    regex: /\*(?<content>.*)\*/im,
    renderInside: true
  },
  {
    type: NodeType.Italic,
    regex: /_(?<content>.*)_/im,
    renderInside: true
  },
  // Features
  {
    type: NodeType.BlockQuote,
    regex: /^> (?<content>.*)$/im,
    renderInside: true
  },
  {
    type: NodeType.OrderedList,
    regex: /^(?<indentation> *)\d*[).] (?<content>.*)$/im,
    renderInside: true
  },
  {
    type: NodeType.UnorderedList,
    regex: /^(?<indentation> *)[*\-+] (?<content>.*)$/im,
    renderInside: true
  },
  {
    type: NodeType.Code,
    regex: /```(?<language>.*)\n(?<content>[\s\S]*?)```/im,
    renderInside: false
  },
  {
    type: NodeType.SingleCode,
    regex: /`(?<content>[^`\n]*)`/im,
    renderInside: false
  },
  {
    type: NodeType.HorizontalRule,
    regex: /^\*\*\*\**$/im,
    renderInside: false
  },
  {
    type: NodeType.HorizontalRule,
    regex: /^----*$/im,
    renderInside: false
  },
  {
    type: NodeType.HorizontalRule,
    regex: /^____*$/im,
    renderInside: false
  },
  {
    type: NodeType.Link,
    regex: /\[(?<content>[^\[\]]*)\]\((?<link>[^\(\)]*)\)/im,
    renderInside: true
  },
  { // Email
    type: NodeType.Link,
    regex: /<(?<content>(?<link>(.+@[^@]+\.[^@]{2,})))>/im,
    renderInside: true
  },
  { // URL
    type: NodeType.Link,
    regex: /<(?<content>(?<link>((www|http:|https:)+[^\s]+[\w])))>/im,
    renderInside: true
  },
  // TODO: Table
]
// Parser
const parse = (input: string, entry = true): MarkDownNode[] => {
  const parsed: MarkDownNode[] = [];
  if (entry) input = input.replace(/\r\n/g, '\n');
  while (input) {
    let currentMatch;
    // Loop over all our regex's, find the earliest match
    for (const Lexem of Lexems) {
      Lexem.regex.lastIndex = 0;
      const match = Lexem.regex.exec(input);
      if (match) {
        if (currentMatch?.index == undefined || match.index == 0 || match.index < currentMatch.index) {
          currentMatch = {
            type: Lexem.type,
            index: match.index,
            content: match.groups?.content || '',
            raw: match[0],
            match: match,
            renderInside: Lexem.renderInside
          };
        }
      }
    }
    if (currentMatch) {
      // Push Text Node made of stuff before the special stuff
      if (currentMatch.index != 0) {
        parsed.push({
          type: NodeType.Text,
          content: input.slice(0, currentMatch.index)
        });
      }
      let metadata: { [key: string]: any } = {};
      if (currentMatch.type == NodeType.Link) metadata.Link = currentMatch.match.groups?.link || '';
      if (
        currentMatch.type == NodeType.UnorderedList ||
        currentMatch.type == NodeType.OrderedList
      ) metadata.Indentation = currentMatch.match.groups?.indentation || '';
      // Push Special Node
      parsed.push({
        type: currentMatch.type,
        content: currentMatch.renderInside ? parse(currentMatch.content, false) : currentMatch.content,
        metadata: metadata
      });
      input = input.slice(currentMatch.index + currentMatch.raw.length);
    } else {
      parsed.push({
        type: NodeType.Text,
        content: input
      });
      break;
    }
  }
  // Return
  return parsed;
};
// Export
export default parse;