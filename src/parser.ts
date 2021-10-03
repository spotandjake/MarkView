import { NodeType, MarkDownNode, MarkDownLexem } from './Types';
// Regex
const Lexems: MarkDownLexem[] = [
  // Headings
  {
    type: NodeType.H1,
    regex: /^# (.*$)/im,
  },
  {
    type: NodeType.H2,
    regex: /^## (.*$)/im,
  },
  {
    type: NodeType.H3,
    regex: /^### (.*$)/im,
  },
  {
    type: NodeType.H4,
    regex: /^#### (.*$)/im,
  },
  {
    type: NodeType.H5,
    regex: /^###### (.*$)/im,
  },
  {
    type: NodeType.H6,
    regex: /^####### (.*$)/im,
  },
  // Text Formatting
  {
    type: NodeType.Bold,
    regex: /\*\*(.*)\*\*/im,
  },
  {
    type: NodeType.Bold,
    regex: /__(.*)__/im,
  },
  {
    type: NodeType.Italic,
    regex: /\*(.*)\*/im,
  },
  {
    type: NodeType.Italic,
    regex: /_(.*)_/im,
  },
  // Features
  {
    type: NodeType.BlockQuote,
    regex: /^> (.*)$/im,
  }
]
// Parser
const parse = (input: string): MarkDownNode[] => {
  const parsed: MarkDownNode[] = [];
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
            content: match[1],
            raw: match[0]
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
      // Push Special Node
      parsed.push({
        type: currentMatch.type,
        content: parse(currentMatch.content)
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