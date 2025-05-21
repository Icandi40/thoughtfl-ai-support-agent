# Thoughtful AI Support Agent

<p align="center">
<img src="public/thoughtful-ai-logo.png" alt="Thoughtful AI Logo" width="120" height="120" />
</p>

<p align="center">
<b>An advanced AI-powered customer support chatbot for healthcare automation</b>
</p>

<p align="center">
This Next.js application provides intelligent, context-aware responses about Thoughtful AI's healthcare agents (EVA, CAM, and PHIL) using advanced NLP techniques, multi-turn conversation tracking, and sophisticated error handling.
</p>

<p align="center">
<a href="#features">Features</a> •
<a href="#demo">Demo</a> •
<a href="#technologies">Technologies</a> •
<a href="#installation">Installation</a> •
<a href="#usage">Usage</a> •
<a href="#project-structure">Project Structure</a> •
<a href="#contributing">Contributing</a> •
<a href="#license">License</a>
</p>

## 🌟 Features

- **Advanced Natural Language Processing**
- Tokenization, stemming, and TF-IDF for accurate query matching
- Entity recognition and topic detection
- Context-aware conversation handling

- **Intelligent Conversation Management**
- Multi-turn conversation tracking
- Follow-up question detection
- User preference analysis for personalized responses

- **Robust Error Handling**
- Automatic retry mechanisms
- Graceful degradation with user-friendly messages
- Comprehensive error logging

- **User Feedback System**
- Thumbs up/down rating for responses
- Optional comment submission for improvement suggestions
- Analytics for tracking response quality

- **Resource Suggestions**
- Context-aware external resource recommendations
- Intelligent fallback responses when information is unavailable

- **Preview Mode**
- Test the chatbot interface without affecting live data
- Simulate conversations with sample data

## 🎬 Demo

![Thoughtful AI Support Agent Demo](https://example.com/demo.gif)

Try the live demo: [Thoughtful AI Support Agent](https://thoughtful-ai-support.vercel.app)

## 🚀 Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **State Management**: React Hooks with custom context management
- **Testing**: Jest, React Testing Library

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
 \`\`\`bash
 git clone https://github.com/yourusername/thoughtful-ai-support.git
 cd thoughtful-ai-support
\`\`\`

2. Install dependencies:
 \`\`\`bash
 npm install
 # or
 yarn install
\`\`\`

3. Set up environment variables:
 Create a `.env.local` file in the root directory with the following variables:
 \`\`\`
 NEXT_PUBLIC_APP_URL=http://localhost:3000
 \`\`\`

4. Start the development server:
 \`\`\`bash
 npm run dev
 # or
 yarn dev
 \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💻 Usage

### Chat Interface

The main chat interface allows users to:
- Ask questions about Thoughtful AI's healthcare agents
- Receive context-aware responses
- Rate responses with thumbs up/down
- Provide feedback for improvement

### Preview Mode

Access the preview mode at `/preview` to test the chat interface without affecting analytics or stored data.

## 📂 Project Structure

\`\`\`
thoughtful-ai-support/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Main chat page
│   ├── preview/          # Preview mode
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── chat-interface.tsx    # Main chat UI
│   ├── chat-message.tsx      # Individual message component
│   ├── feedback-buttons.tsx  # User feedback UI
│   └── ...
├── hooks/                # Custom React hooks
│   └── use-chat-agent.ts # Chat logic and state management
├── lib/                  # Utility functions and data
│   ├── analytics.ts      # Analytics tracking
│   ├── conversation-context.ts # Conversation state management
│   ├── error-recovery.ts # Error handling utilities
│   ├── faq-data.ts       # FAQ dataset
│   ├── nlp-utils.ts      # NLP processing utilities
│   └── ...
├── public/               # Static assets
└── ...
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
