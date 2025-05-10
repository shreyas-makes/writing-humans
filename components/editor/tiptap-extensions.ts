import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Placeholder from "@tiptap/extension-placeholder"

export const extensions = [
  StarterKit,
  Highlight,
  Typography,
  Placeholder.configure({
    placeholder: "Start writing here...",
    emptyEditorClass: 'is-editor-empty',
    emptyNodeClass: 'is-node-empty',
  }),
]
