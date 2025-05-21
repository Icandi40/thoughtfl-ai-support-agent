export function Header() {
  return (
    <div className="bg-thoughtful-navy text-white py-6 px-8 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gradient-brand p-[2px]">
            <div className="w-full h-full bg-thoughtful-navy rounded-[4px] flex items-center justify-center overflow-hidden">
              <img src="/thoughtful-ai-logo.png" alt="Thoughtful AI Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-brand">Thoughtful AI</span>
            </h1>
            <p className="text-gray-300 text-sm">Powering healthcare with advanced AI Agents</p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-gradient-to-r from-thoughtful-coral to-thoughtful-pink px-4 py-2 rounded-lg">
            <p className="text-sm font-medium text-white">Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
