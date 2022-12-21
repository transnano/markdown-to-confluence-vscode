/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019 Tadayuki Onishi
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import escapeStringRegexp from "escape-string-regexp";
import { Renderer, Slugger } from "marked";

import {
  AtlassianSupportLanguage,
  markdownToWikiMarkupLanguageMapping,
} from "./language";

export const CodeBlockTheme = {
  DJango: "DJango",
  Emacs: "Emacs",
  FadeToGrey: "FadeToGrey",
  Midnight: "Midnight",
  RDark: "RDark",
  Eclipse: "Eclipse",
  Confluence: "Confluence",
} as const;
type CodeBlockTheme = typeof CodeBlockTheme[keyof typeof CodeBlockTheme];

export type MarkdownToAtlassianWikiMarkupOptions = {
  codeBlock?: {
    theme?: CodeBlockTheme;
    showLineNumbers?:
      | boolean
      | ((code: string, lang: AtlassianSupportLanguage) => boolean);
    collapse?:
      | boolean
      | ((code: string, lang: AtlassianSupportLanguage) => boolean);
  };
  replaceNewLinesInParagraphs?: boolean | string;
};

type ListHeadCharacter = {
  Numbered: "#";
  Bullet: "*";
};
const ListHeadCharacter: ListHeadCharacter = {
  Numbered: "#",
  Bullet: "*",
};

type TableCellTypeCharacter = {
  Header: "||";
  NonHeader: "|";
};
const TableCellTypeCharacter: TableCellTypeCharacter = {
  Header: "||",
  NonHeader: "|",
};

const confluenceListRegExp = new RegExp(
  `^(${Object.values(ListHeadCharacter).map(escapeStringRegexp).join("|")})`
);

const replaceSingleNewlineWithSpace = (
  text: string,
  rendererOptions: MarkdownToAtlassianWikiMarkupOptions | undefined
): string => {
  const replaceNewLinesInParagraphs =
    rendererOptions?.replaceNewLinesInParagraphs || false;
  if (replaceNewLinesInParagraphs === false) return text;
  const replacementText =
    replaceNewLinesInParagraphs === true ? " " : replaceNewLinesInParagraphs;
  return text.replace(/((\r)?\n)/g, replacementText).trim();
};

const unescapeHtmlSpecialCharacteres = (text: string): string => {
  return text.replace(
    /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,
    (substring: string, matchedString: string) => {
      const lowered = matchedString.toLowerCase();
      if (lowered === "colon") {
        return ":";
      }

      if (lowered === "amp") {
        return "&";
      }

      if (lowered === "lt") {
        return "<";
      }

      if (lowered === "gt") {
        return ">";
      }

      if (lowered === "quot") {
        return '"';
      }

      if (lowered.charAt(0) === "#" && lowered.charAt(1) === "x") {
        return String.fromCharCode(parseInt(lowered.substring(2), 16));
      }

      if (lowered.charAt(0) === "#" && lowered.charAt(1) !== "x") {
        return String.fromCharCode(Number(lowered.substring(1)));
      }

      return substring;
    }
  );
};

export class AtlassianWikiMarkupRenderer extends Renderer {
  private rendererOptions?: MarkdownToAtlassianWikiMarkupOptions;

  public constructor(rendererOptions?: MarkdownToAtlassianWikiMarkupOptions) {
    super();
    this.rendererOptions = rendererOptions;
  }

  public paragraph(text: string): string {
    const replacedText = replaceSingleNewlineWithSpace(
      text,
      this.rendererOptions
    );
    const unescapedText = unescapeHtmlSpecialCharacteres(replacedText);
    return `${unescapedText}\n\n`;
  }

  public heading(
    text: string,
    level: number,
    _raw: string,
    _slugger: Slugger
  ): string {
    return `h${level}. ${text}\n\n`;
  }

  public strong(text: string): string {
    return `*${text}*`;
  }

  public em(text: string): string {
    return `_${text}_`;
  }

  public del(text: string): string {
    return `-${text}-`;
  }

  public codespan(text: string): string {
    return `{{${text}}}`;
  }

  public blockquote(quote: string): string {
    return `{quote}${quote.trim()}{quote}`;
  }

  public br(): string {
    return "\n";
  }

  public hr(): string {
    return "----\n";
  }

  public link(href: string, title: string | null, text: string): string {
    const linkAlias = text === "" ? title : text;

    return linkAlias ? `[${linkAlias}|${href}]` : `[${href}]`;
  }

  public list(body: string, ordered: boolean, _start: number | ""): string {
    const lines = body
      .trim()
      .split("\n")
      .filter((line) => !!line);
    const type = ordered
      ? ListHeadCharacter.Numbered
      : ListHeadCharacter.Bullet;
    const joinedLine = lines
      .map((line) => {
        return line.match(confluenceListRegExp)
          ? `${type}${line}`
          : `${type} ${line}`;
      })
      .join("\n");

    return `\n${joinedLine}\n\n`;
  }

  public listitem(body: string): string {
    return `${body}\n`;
  }

  public checkbox(_checked: boolean): string {
    // Confluence wiki does not support checkbox.
    return "";
  }

  public image(href: string, title: string | null, text: string): string {
    const params = {
      alt: text,
      title: title,
    };
    const paramsString = Object.entries(params)
      .filter(([, value]) => {
        return value !== null && value.trim() !== "";
      })
      // Sort by key to prevent the order from changing in the way of defining params
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]) => `${key}=${value}`)
      .join(",");

    return paramsString === "" ? `!${href}!` : `!${href}|${paramsString}!`;
  }

  public table(header: string, body: string): string {
    const tableContent = `${header}${body}`.trim();
    return `\n${tableContent}\n`;
  }

  public tablerow(content: string): string {
    const removedEscapePipe = content.replace("\\|", "");
    const twoPipeMatch = removedEscapePipe.match(/\|\|(?!.*\|\|)/);
    const onePipeMatch = removedEscapePipe.match(/\|(?!.*\|)/);
    const rowCloseType = ((): TableCellTypeCharacter[keyof TableCellTypeCharacter] => {
      if (!onePipeMatch?.index) {
        throw new Error(
          "The table row expects at least one '|' in the table cell."
        );
      }

      if (twoPipeMatch?.index) {
        const indexDiff = onePipeMatch.index - twoPipeMatch.index;
        return indexDiff === 1
          ? TableCellTypeCharacter.Header
          : TableCellTypeCharacter.NonHeader;
      }

      return TableCellTypeCharacter.NonHeader;
    })();

    return `${content}${rowCloseType}\n`;
  }

  public tablecell(
    content: string,
    flags: {
      header: boolean;
      align: "center" | "left" | "right" | null;
    }
  ): string {
    const type = flags.header
      ? TableCellTypeCharacter.Header
      : TableCellTypeCharacter.NonHeader;
    const emptyComplementedContent = content === "" ? "\u{0020}" : content;
    return `${type}${emptyComplementedContent}`;
  }

  public code(
    code: string,
    language: string | undefined,
    _isEscaped: boolean
  ): string {
    const theme =
      (this.rendererOptions &&
        this.rendererOptions.codeBlock &&
        this.rendererOptions.codeBlock.theme) ||
      CodeBlockTheme.Confluence;

    const usingLang = language
      ? markdownToWikiMarkupLanguageMapping.get(language.toLowerCase()) ||
        AtlassianSupportLanguage.None
      : AtlassianSupportLanguage.None;

    const isDisplayLinenumbers = ((): boolean => {
      const defaultValue = false;
      if (!this.rendererOptions?.codeBlock) {
        return defaultValue;
      }

      if (this.rendererOptions.codeBlock.showLineNumbers instanceof Function) {
        return this.rendererOptions.codeBlock.showLineNumbers(code, usingLang);
      }

      return this.rendererOptions.codeBlock.showLineNumbers ?? defaultValue;
    })();

    const isCollapseCodeBlock = ((): boolean => {
      const defaultValue = false;
      if (!this.rendererOptions?.codeBlock) {
        return defaultValue;
      }

      if (this.rendererOptions.codeBlock.collapse instanceof Function) {
        return this.rendererOptions.codeBlock.collapse(code, usingLang);
      }

      return this.rendererOptions.codeBlock.collapse ?? defaultValue;
    })();

    const params = {
      language: usingLang,
      theme: theme,
      linenumbers: isDisplayLinenumbers,
      collapse: isCollapseCodeBlock,
    };
    const paramsString = Object.entries(params)
      // Sort by key to prevent the order from changing in the way of defining params
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([key, value]) => `${key}=${value}`)
      .join("|");
    return `{code:${paramsString}}\n${code}\n{code}\n\n`;
  }
}
