export interface Suggestion {
  id?: string
  document_id: string
  daemon: string
  text: string
  suggestion: string
  paragraph_id: number
  text_offset: number // Changed from offset to text_offset to match DB schema
  bookmarked: boolean
  created_at?: string
}

export interface Document {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      documents: {
        Row: Document
        Insert: Omit<Document, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Document, "id" | "created_at">>
      }
      suggestions: {
        Row: Suggestion
        Insert: Omit<Suggestion, "id" | "created_at">
        Update: Partial<Omit<Suggestion, "id" | "created_at">>
      }
    }
  }
}
