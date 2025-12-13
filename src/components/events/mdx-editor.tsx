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
    <MDXEditor
      ref={ref}
      {...props}
      contentEditableClassName="prose dark:prose-invert max-w-none font-sans px-4 py-2 text-foreground prose-headings:text-foreground prose-strong:text-foreground"
      
      plugins={[
        headingsPlugin(), 
        listsPlugin(), 
        quotePlugin(), 
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
            </>
          )
        })
      ]}
      className="min-h-100 w-full bg-background border rounded-md dark-theme"
    />
  );
});

Editor.displayName = "MDXEditorWrapper";

export default Editor;