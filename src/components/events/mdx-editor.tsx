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
    <div className="h-100 w-full border rounded-md bg-background overflow-scroll dark-theme">
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
            <div className="flex items-center gap-2 bg-accent p-1">
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
            </div>
          )
        })
      ]}
    />
    </div>
  );
});

Editor.displayName = "MDXEditorWrapper";

export default Editor;