"use client"

export function Footer() {
  return (
    <div className="p-2 text-center">
      <p className="text-xs bg-gradient-brand bg-clip-text text-transparent font-medium">
        © {new Date().getFullYear()} Thoughtful AI. All rights reserved.
      </p>
      <style jsx>{`
        p {
          background-image: linear-gradient(to right, #FF5C00, #FF5C35, #E91E63, #9C27B0);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  )
}
