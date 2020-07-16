import {
  AtlassianSupportLanguageValues,
  CodeBlockTheme,
  markdownToAtlassianWikiMarkup,
} from "./index";

describe("markdownToAtlassianWikiMarkup", () => {
  const paragraphNewLinesAtTail = "\n\n";

  describe("Paragraph", () => {
    it("should render with two new lines", () => {
      const markdown = `This is first paragraph.

This is second paragraph.`;
      const expected = `This is first paragraph.

This is second paragraph.${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });

    describe("HTML special characters", () => {
      it("should not be escaped", () => {
        const markdown = "\" & : < > '";
        const expected = `" & : < > '${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Heading", () => {
    describe("with sharpe number signs", () => {
      it("should render with 'h'", () => {
        const markdown = `# This is h1

## This is h2

### This is h3

#### This is h4

##### This is h5

###### This is h6`;
        const expected = `h1. This is h1

h2. This is h2

h3. This is h3

h4. This is h4

h5. This is h5

h6. This is h6

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with alternate syntax", () => {
      it("should render with 'h'", () => {
        const markdown = `This is h1
===============

This is h2
---------------`;
        const expected = `h1. This is h1

h2. This is h2

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Strong", () => {
    it("should render sandwiched by '*'", () => {
      const markdown = "**bold by asterisks** __bold by underscores__";
      const expected = `*bold by asterisks* *bold by underscores*${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Emphasis", () => {
    it("should render sandwiched by '_'", () => {
      const markdown = "*italic by asterisks* _italic by underscores_";
      const expected = `_italic by asterisks_ _italic by underscores_${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Del", () => {
    it("should render sandwiched by '-'", () => {
      const markdown = "~~deleted by tildes~~";
      const expected = `-deleted by tildes-${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Code Span", () => {
    it("should render sandwiched by '{{' and '}}'", () => {
      const markdown = "`code span by backticks`";
      const expected = `{{code span by backticks}}${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Blockquote", () => {
    it("should render sandwiched by '{quote}'", () => {
      const markdown = `> This is quote first line.
This is quote second line.
`;
      const expected = `{quote}This is quote first line.
This is quote second line.{quote}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Hard Line Breaks", () => {
    it("should render with new line", () => {
      const markdown = `This is new line first.\\
This is new line second.`;
      const expected = `This is new line first.
This is new line second.${paragraphNewLinesAtTail}`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Horizontal Rule", () => {
    it("should render four minuses", () => {
      const markdown = `---
***
___`;
      const expected = `----
----
----
`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Link", () => {
    describe("with text", () => {
      it("should render sandwiched by '[' and ']' with text", () => {
        const markdown = "[This is text](http://example.com)";
        const expected = `[This is text|http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("without text and title", () => {
      it("should render sandwiched by '[' and ']'", () => {
        const markdown = "[](http://example.com)";
        const expected = `[http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with title", () => {
      it("should render sandwiched by '[' and ']' with text", () => {
        const markdown = "[](http://example.com 'This is title')";
        const expected = `[This is title|http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("without text", () => {
      it("should render sandwiched by '[' and ']'", () => {
        const markdown = "[](http://example.com)";
        const expected = `[http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with text and title", () => {
      it("should render sandwiched by '[' and ']' and prioritize text", () => {
        const markdown = "[This is text](http://example.com 'This is title')";
        const expected = `[This is text|http://example.com]${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("List and List Item", () => {
    describe("bullet list", () => {
      it("should render list with asterisks", () => {
        const markdown = `- This is list 1
- This is list 2
    - This is list 2-1
    - This is list 2-2
        - This is list 2-2-1
- This is list 3`;
        const expected = `
* This is list 1
* This is list 2
** This is list 2-1
** This is list 2-2
*** This is list 2-2-1
* This is list 3

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("numbered list", () => {
      it("should render list with sharps", () => {
        const markdown = `1. This is list 1
2. This is list 2
    1. This is list 2-1
    2. This is list 2-2
        1. This is list 2-2-1
3. This is list 3`;
        const expected = `
# This is list 1
# This is list 2
## This is list 2-1
## This is list 2-2
### This is list 2-2-1
# This is list 3

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("bullet and numbered list", () => {
      it("should render list with sterisks and sharps", () => {
        const markdown = `1. This is list 1
2. This is list 2
    - This is list 2-1
    - This is list 2-2`;
        const expected = `
# This is list 1
# This is list 2
#* This is list 2-1
#* This is list 2-2

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Checkbox", () => {
    it("should render blank", () => {
      const markdown = `- [ ] This is checkbox without checked
- [x] This is checkbox with checked`;
      const expected = `
* <input type="checkbox" disabled=""> This is checkbox without checked
* <input type="checkbox" disabled="" checked=""> This is checkbox with checked

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Image", () => {
    describe("without description", () => {
      it("should render sandwiched by '!'", () => {
        const markdown = "![](http://exmaple.com/example.png)";
        const expected = `!http://exmaple.com/example.png!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with description", () => {
      it("should render sandwiched by '!' with description as alt", () => {
        const markdown =
          "![This is description](http://exmaple.com/example.png)";
        const expected = `!http://exmaple.com/example.png|alt=This is description!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("without title", () => {
      it("should render sandwiched by '!'", () => {
        const markdown = "![](http://exmaple.com/example.png)";
        const expected = `!http://exmaple.com/example.png!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with title", () => {
      it("should render sandwiched by '!' with title", () => {
        const markdown = "![](http://exmaple.com/example.png 'This is title')";
        const expected = `!http://exmaple.com/example.png|title=This is title!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });

    describe("with multiple params", () => {
      it("should render sandwiched by '!' and joined by ','", () => {
        const markdown =
          "![This is description](http://exmaple.com/example.png 'This is title')";
        const expected = `!http://exmaple.com/example.png|alt=This is description,title=This is title!${paragraphNewLinesAtTail}`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });

  describe("Table", () => {
    it("should render header sandwiched by '||' and row sandwiched by '|'", () => {
      const markdown = `header1|header2
---|---
row1, col1|row1, col2
|
row2, col1|row2, col2
`;
      const expected = `
||header1||header2||
|row1, col1|row1, col2|
|\u{0020}|\u{0020}|
|row2, col1|row2, col2|
`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });
  });

  describe("Code", () => {
    it("should render sandwiched by '{code}' with parameters", () => {
      const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;
      const expected = `{code:collapse=false|language=javascript|linenumbers=false|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown);
      expect(rendered).toBe(expected);
    });

    describe("when not found language", () => {
      it("should render sandwiched by '{code}' with none parameter", () => {
        const markdown = `
\`\`\`pony
actor Main
  new create(env: Env) =>
    env.out.print("Hello, world!")
\`\`\`
`;
        const expected = `{code:collapse=false|language=none|linenumbers=false|theme=Confluence}
actor Main
  new create(env: Env) =>
    env.out.print("Hello, world!")
{code}

`;
        const rendered = markdownToAtlassianWikiMarkup(markdown);
        expect(rendered).toBe(expected);
      });
    });
  });
});

describe("markdownToAtlassianWikiMarkup Options", () => {
  describe("codeBlockTheme", () => {
    it("should use specified code block theme", () => {
      const theme = CodeBlockTheme.Midnight;
      const options = {
        codeBlock: {
          theme: theme,
        },
      };

      const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;
      const expected = `{code:collapse=false|language=javascript|linenumbers=false|theme=${theme}}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });
  });

  describe("showCodeBlockLineNumber", () => {
    const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;

    it("should use specified code block used linenumber or not", () => {
      const options = {
        codeBlock: {
          showLineNumbers: true,
        },
      };

      const expected = `{code:collapse=false|language=javascript|linenumbers=true|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });

    it("should use specified code block used linenumber or not with function", () => {
      const options = {
        codeBlock: {
          showLineNumbers: (
            _code: string,
            _lang: AtlassianSupportLanguageValues
          ): boolean => true,
        },
      };

      const expected = `{code:collapse=false|language=javascript|linenumbers=true|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });
  });

  describe("collapse", () => {
    const markdown = `
\`\`\`javascript
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
\`\`\`
`;

    it("should use specified code block used collapse or not", () => {
      const options = {
        codeBlock: {
          collapse: true,
        },
      };

      const expected = `{code:collapse=true|language=javascript|linenumbers=false|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });

    it("should use specified code block used collapse or not with function", () => {
      const options = {
        codeBlock: {
          collapse: (
            _code: string,
            _lang: AtlassianSupportLanguageValues
          ): boolean => true,
        },
      };

      const expected = `{code:collapse=true|language=javascript|linenumbers=false|theme=Confluence}
const helloWorld = () => {
  return "Hello World";
};
helloWorld();
{code}

`;
      const rendered = markdownToAtlassianWikiMarkup(markdown, options);
      expect(rendered).toBe(expected);
    });
  });
});
