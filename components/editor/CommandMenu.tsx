"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useEffect, useRef } from "react"

interface CommandMenuProps {
  position: { x: number; y: number }
  onSelect: (command: string) => void
  onClose: () => void
}

const COMMANDS = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Bold", value: "bold" },
  { label: "Italic", value: "italic" },
  { label: "Quote", value: "quote" },
  { label: "Code Block", value: "code" },
]

export function CommandMenu({ position, onSelect, onClose }: CommandMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute z-50 w-64"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Formatting">
            {COMMANDS.map((command) => (
              <CommandItem
                key={command.value}
                onSelect={() => {
                  onSelect(command.value)
                  onClose()
                }}
              >
                {command.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
