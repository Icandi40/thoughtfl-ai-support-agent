"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Chat" },
    { href: "/preview", label: "Preview Mode" },
  ]

  return (
    <nav className="bg-thoughtful-navy bg-opacity-90 py-2 px-8 border-b border-thoughtful-navy border-opacity-20">
      <div className="max-w-4xl mx-auto flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-1 mx-2 rounded-md text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-gradient-brand text-white"
                : "text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
