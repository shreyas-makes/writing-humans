"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Create a wrapper function that matches our existing toast API
const toast = (props: ToastProps) => {
  if (props.variant === "destructive") {
    return sonnerToast.error(props.title, {
      description: props.description,
    })
  }
  return sonnerToast(props.title, {
    description: props.description,
  })
}

export { toast }
export const useToast = () => ({ toast }) 