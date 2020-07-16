"use strict";

import * as vscode from "vscode";
import { markdownToAtlassianWikiMarkup } from "@kenchan0130/markdown-to-atlassian-wiki-markup";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.md2confl.convert",
    function () {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;

        // Get the all words
        const content = document.getText();
        const wikiMarkup = markdownToAtlassianWikiMarkup(content);
        console.log(wikiMarkup);
      }
    }
  );

  context.subscriptions.push(disposable);
}
