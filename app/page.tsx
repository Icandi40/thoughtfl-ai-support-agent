import { ChatInterface } from "@/components/chat-interface"
import { Header } from "@/components/header"
import { ErrorBoundary } from "@/components/error-boundary"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-thoughtful-navy">
      <Header />
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl h-[600px] bg-white rounded-lg shadow-xl overflow-hidden">
          <ErrorBoundary>
            <ChatInterface />
          </ErrorBoundary>
        </div>
      </div>
    </main>
  )
}
