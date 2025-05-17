"use client"

import { createContext, useContext } from 'react';
import type { Editor } from '@tiptap/react';

interface EditorContextType {
  editor: Editor | null;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }
  return context;
};

interface EditorProviderProps {
  children: React.ReactNode;
  editor: Editor | null;
}

export const EditorProvider = ({ children, editor }: EditorProviderProps) => {
  return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>;
}; 