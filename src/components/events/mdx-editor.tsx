// components/events/mdx-editor.tsx
import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin,
  markdownShortcutPlugin,
  type MDXEditorMethods, 
  type MDXEditorProps, 
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef } from "react";

const Editor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => {
  return (
    // 1. Wrapper: Controls height and ensures internal scrolling
    <div className="h-125 w-full border rounded-md bg-background flex flex-col overflow-hidden dark-theme shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <MDXEditor
        ref={ref}
        {...props}
        // 2. Content Area: Adds padding and typography styles
        contentEditableClassName="prose dark:prose-invert max-w-none font-sans px-8 py-6 text-foreground prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:leading-7"
        
        plugins={[
          headingsPlugin(), 
          listsPlugin(), 
          quotePlugin(), 
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            // 3. Toolbar: Styled to look like a proper header
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-1 w-full p-2 border-b bg-muted/30">
                <div className="flex items-center gap-1 mr-2">
                  <UndoRedo />
                </div>
                <div className="h-6 w-px bg-border mx-2" /> {/* Divider */}
                <BlockTypeSelect />
                <div className="h-6 w-px bg-border mx-2" /> {/* Divider */}
                <div className="flex items-center gap-1">
                  <BoldItalicUnderlineToggles />
                </div>
                <div className="h-6 w-px bg-border mx-2" /> {/* Divider */}
                <ListsToggle />
              </div>
            )
          })
        ]}
        className="h-full w-full overflow-y-auto"
      />
    </div>
  );
});

Editor.displayName = "MDXEditorWrapper";
export default Editor;