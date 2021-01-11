# Convert markdown to confluence(atlassian wiki markup) for VSCode Extension

[![](https://vsmarketplacebadge.apphb.com/version/t-nano.markdown-to-confluence-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=t-nano.markdown-to-confluence-vscode) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/t-nano.markdown-to-confluence-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=t-nano.markdown-to-confluence-vscode) [![Installs](https://vsmarketplacebadge.apphb.com/installs/t-nano.markdown-to-confluence-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=t-nano.markdown-to-confluence-vscode)

![Test and Lint](https://github.com/transnano/markdown-to-confluence-vscode/workflows/Test%20and%20Lint/badge.svg)

## Features

Convert markdown to confluence(atlassian wiki markup).

From:

```markdown
# Convert markdown to confluence(atlassian wiki markup) for VSCode Extension
Repository
[transnano/markdown-to-confluence-vscode](https://github.com/transnano/markdown-to-confluence-vscode)
```

To:

```wiki
h1. Convert markdown to confluence(atlassian wiki markup) for VSCode Extension

Repository
[transnano/markdown-to-confluence-vscode|https://github.com/transnano/markdown-to-confluence-vscode]
```

## Command (Usage)

Using Command Palette ( `CMD/CTRL + Shift + P` )

There are two methods following:

### 1. Clipboard

1. `CMD/CTRL + Shift + P` -> `md2confl: Convert markdown to confluence and Copy to clipboard`
2. Paste to the Confluence

### 2. Window(Dialog)

1. `CMD/CTRL + Shift + P` -> `md2confl: Convert markdown to confluence and Open window`
2. Copy text from the window
3. Paste to the Confluence

## Configuration

See details: [Code Block Macro | Confluence Data Center and Server 7.10 | Atlassian Documentation](https://confluence.atlassian.com/doc/code-block-macro-139390.html).

item            | type    | default
--------------- | ------- | ----------
collapse        | boolean | false
showLineNumbers | boolean | true
theme           | string  | Confluence

### 1. md2confl.codeBlock.collapse

If selected, the code macro's content will be collapsed upon visiting or refreshing the Confluence page.

### 2. md2confl.codeBlock.showLineNumbers

If selected, line numbers will be shown to the left of the lines of code.

### 3. md2confl.codeBlock.theme

Specifies the color scheme used for displaying your code block.

- **DJango**
- **Emacs**
- **FadeToGrey**
- **Midnight**
- **RDark**
- **Eclipse**
- **Confluence**

## Release Notes

Update infomation.

Ref: [CHANGELOG.md](https://github.com/transnano/markdown-to-confluence-vscode/blob/master/CHANGELOG.md)

## Special thanks

[kenchan0130/markdown-to-atlassian-wiki-markup: Convert markdown to atlassian wiki markup - v3.0.6](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup) that is released under the MIT License, see [LICENSE](https://github.com/kenchan0130/markdown-to-atlassian-wiki-markup/blob/v3.0.6/LICENSE).

forked it and extend checkbox for list-item.
