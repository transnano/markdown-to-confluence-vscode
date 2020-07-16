import marked from "marked";

import {
  AtlassianWikiMarkupRenderer,
  MarkdownToAtlassianWikiMarkupOptions,
} from "./confluenceRenderer";

export {
  AtlassianWikiMarkupRenderer,
  MarkdownToAtlassianWikiMarkupOptions,
  CodeBlockTheme,
  CodeBlockThemeValues,
} from "./confluenceRenderer";

export {
  AtlassianSupportLanguage,
  AtlassianSupportLanguageValues,
} from "./language";

export const markdownToAtlassianWikiMarkup = (
  markdown: string,
  options?: MarkdownToAtlassianWikiMarkupOptions
): string => {
  const renderer = new AtlassianWikiMarkupRenderer(options);
  return marked(markdown, { renderer: renderer });
};
