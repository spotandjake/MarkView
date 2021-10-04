export const enum NodeType {
  // Heading
  H1 = "H1",
  H2 = "H2",
  H3 = "H3",
  H4 = "H4",
  H5 = "H5",
  H6 = "H6",
  // Text Formatting
  Bold = "Bold",
  Italic = "Italic",
  // Features
  BlockQuote = "BlockQuote",
  OrderedList = "OrderedList",
  UnorderedList = "UnorderedList",
  Code = "Code",
  SingleCode = "SingleCode",
  HorizontalRule = "HorizontalRule",
  Link = "Link",
  Table = "Table",
  // Normal Text
  Text = "Text",
}

export interface MarkDownNode {
  type: NodeType;
  content: string | MarkDownNode[];
  metadata?: { [key: string]: any };
}
export interface MarkDownLexem {
  type: NodeType;
  regex: RegExp;
  renderInside: boolean;
}