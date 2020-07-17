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
import "ts-polyfill/lib/es2019-array"; // It will be removed when node 10 is stopped supporting (become EOL).

import { immutable as uniq } from "array-unique";

import {
  AtlassianSupportLanguage,
  GitHubFlaveredMarkdownCodeBlockLanguageMapping,
  markdownToWikiMarkupLanguageMapping,
} from "./language";

describe("AtlassianSupportLanguage", () => {
  describe("enum values", () => {
    const enumValues = Object.values(AtlassianSupportLanguage);

    it("should be uniq", () => {
      expect(enumValues).toEqual(uniq(enumValues));
    });

    it("should not contain at least one capital letter", () => {
      expect(enumValues).toEqual(
        expect.arrayContaining([expect.not.stringMatching(/[A-Z]/)])
      );
    });
  });
});

describe("GitHubFlaveredMarkdownCodeBlockLanguageMapping", () => {
  describe("enum values", () => {
    const enumFlattenValues = Object.values(
      GitHubFlaveredMarkdownCodeBlockLanguageMapping
    ).flat();

    it("should be uniq", () => {
      expect(enumFlattenValues).toEqual(uniq(enumFlattenValues));
    });

    it("should not contain at least one capital letter", () => {
      expect(enumFlattenValues).toEqual(
        expect.arrayContaining([expect.not.stringMatching(/[A-Z]/)])
      );
    });
  });
});

describe("markdownToWikiMarkupLanguageMapping", () => {
  describe("supported github flaver markdown and atlassian wiki code blocklanguage", () => {
    it("should return atlassian wiki markup language", () => {
      const supportedLanguage = "osascript";
      expect(
        markdownToWikiMarkupLanguageMapping.get(supportedLanguage)
      ).toEqual(AtlassianSupportLanguage.AppleScript);
    });
  });

  describe("non supported github flaver markdown and atlassian wiki code block language", () => {
    it("should return undefined", () => {
      const nonSupportedLanguage = "tex";

      expect(
        markdownToWikiMarkupLanguageMapping.get(nonSupportedLanguage)
      ).toBeUndefined();
    });
  });
});
