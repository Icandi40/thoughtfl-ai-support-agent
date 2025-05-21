export interface FAQItem {
  question: string
  answer: string
  category?: string
  alternativeQuestions?: string[]
}

// Welcome messages
export const welcomeMessages = [
  "Hello! I'm the Thoughtful AI Support Agent. How can I help you today?",
  "Welcome to Thoughtful AI support! I'm here to answer your questions about our healthcare agents.",
  "Hi there! I'm your Thoughtful AI assistant. What would you like to know about our healthcare automation solutions?",
]

// Welcome back messages
export const welcomeBackMessages = [
  "Welcome back! How can I assist you with Thoughtful AI's healthcare agents today?",
  "Good to see you again! What questions do you have about our healthcare automation solutions?",
  "Hello again! I'm here to help with any questions about Thoughtful AI's healthcare agents.",
]

// Check-in messages
export const checkInMessages = [
  "Is there anything else you'd like to know about Thoughtful AI's healthcare agents?",
  "Do you have any other questions I can help with?",
  "Is there something specific about our healthcare automation solutions you're interested in?",
]

// Farewell messages
export const farewellMessages = [
  "Thank you for chatting with Thoughtful AI Support. Have a great day!",
  "It was a pleasure assisting you. Feel free to return if you have more questions!",
  "Thanks for your interest in Thoughtful AI. Don't hesitate to reach out if you need further assistance!",
]

// FAQ data
export const faqData: FAQItem[] = [
  {
    question: "What is Thoughtful AI?",
    answer:
      "Thoughtful AI is a healthcare automation platform that uses artificial intelligence to streamline revenue cycle management processes. Our AI agents handle tasks like eligibility verification, claims processing, and payment posting, allowing healthcare providers to reduce costs and improve efficiency.",
    category: "general",
    alternativeQuestions: ["Tell me about Thoughtful AI", "What does Thoughtful AI do?", "Explain Thoughtful AI"],
  },
  {
    question: "What healthcare agents does Thoughtful AI offer?",
    answer:
      "Thoughtful AI offers three main healthcare agents: EVA (Eligibility Verification Agent), CAM (Claims Agent Manager), and PHIL (Payment Handling Intelligence Layer). These agents work together to automate the entire revenue cycle management process for healthcare providers.",
    category: "agents",
    alternativeQuestions: [
      "What agents do you have?",
      "Tell me about your AI agents",
      "What AI solutions do you offer?",
    ],
  },
  {
    question: "What is EVA?",
    answer:
      "EVA (Eligibility Verification Agent) is our AI solution that automates insurance eligibility verification. It connects with payer systems to verify patient insurance in real-time, checking coverage details, co-pays, deductibles, and authorization requirements. This significantly reduces manual work and errors in the verification process.",
    category: "eligibility_verification",
    alternativeQuestions: [
      "Tell me about EVA",
      "How does eligibility verification work?",
      "What is your eligibility verification agent?",
    ],
  },
  {
    question: "What is CAM?",
    answer:
      "CAM (Claims Agent Manager) is our AI solution for claims processing. It automates claim submission, tracks claim status, identifies potential issues before submission, and helps manage denials. CAM ensures claims are submitted correctly the first time, reducing denials and accelerating reimbursement.",
    category: "claims_processing",
    alternativeQuestions: [
      "Tell me about CAM",
      "How does claims processing work?",
      "What is your claims processing agent?",
    ],
  },
  {
    question: "What is PHIL?",
    answer:
      "PHIL (Payment Handling Intelligence Layer) is our AI solution for payment posting and reconciliation. It automatically matches payments to claims, processes EOBs and ERAs, identifies underpayments, and updates your financial systems. PHIL streamlines the payment posting process, reducing manual work and improving accuracy.",
    category: "payment_posting",
    alternativeQuestions: [
      "Tell me about PHIL",
      "How does payment posting work?",
      "What is your payment posting agent?",
    ],
  },
  {
    question: "How do your agents work together?",
    answer:
      "Our agents work together seamlessly to automate the entire revenue cycle. EVA verifies patient insurance eligibility, CAM processes and submits claims based on that eligibility information, and PHIL handles payment posting and reconciliation once payments are received. This end-to-end automation reduces manual work, improves accuracy, and accelerates cash flow.",
    category: "agents",
    alternativeQuestions: [
      "Do your agents integrate with each other?",
      "How do EVA, CAM, and PHIL work together?",
      "Is this an end-to-end solution?",
    ],
  },
  {
    question: "What are the benefits of using Thoughtful AI?",
    answer:
      "The key benefits of using Thoughtful AI include: reduced operational costs (typically 30-50%), faster reimbursements, fewer claim denials, improved cash flow, reduced manual work, higher accuracy rates, and better staff satisfaction as they can focus on higher-value tasks instead of routine processing.",
    category: "benefits",
    alternativeQuestions: [
      "Why should I use Thoughtful AI?",
      "What advantages do your agents provide?",
      "How will Thoughtful AI help my practice?",
    ],
  },
  {
    question: "How much does Thoughtful AI cost?",
    answer:
      "Thoughtful AI pricing is based on your organization's size and needs. We offer flexible pricing models including per-transaction, monthly subscription, or outcome-based pricing. Most clients see ROI within 3-6 months. Contact our sales team at sales@thoughtful.ai for a customized quote.",
    category: "pricing",
    alternativeQuestions: [
      "What is your pricing?",
      "How much do your agents cost?",
      "What's the price of Thoughtful AI?",
    ],
  },
  {
    question: "How do I get started with Thoughtful AI?",
    answer:
      "Getting started with Thoughtful AI is easy. Contact our sales team at sales@thoughtful.ai or call 1-800-THOUGHTFUL to schedule a demo. We'll assess your needs, provide a customized solution, and guide you through implementation. Our typical implementation takes 4-6 weeks, with minimal disruption to your existing workflows.",
    category: "onboarding",
    alternativeQuestions: [
      "How to implement Thoughtful AI?",
      "What's the onboarding process?",
      "How do I deploy your agents?",
    ],
  },
  {
    question: "Do your agents integrate with existing systems?",
    answer:
      "Yes, our agents are designed to integrate with your existing EHR, practice management, and billing systems. We support integration with major platforms like Epic, Cerner, Allscripts, athenahealth, and many others. Our implementation team will handle the integration process to ensure a smooth transition.",
    category: "integration",
    alternativeQuestions: [
      "Can I use Thoughtful AI with my current EHR?",
      "Do you integrate with my billing system?",
      "How does integration work?",
    ],
  },
  {
    question: "Is Thoughtful AI HIPAA compliant?",
    answer:
      "Yes, Thoughtful AI is fully HIPAA compliant. We implement comprehensive security measures including encryption, access controls, audit logs, and regular security assessments. We sign Business Associate Agreements (BAAs) with all clients and ensure all data handling meets or exceeds HIPAA requirements.",
    category: "security",
    alternativeQuestions: [
      "How secure is Thoughtful AI?",
      "Do you protect patient data?",
      "Is patient information safe?",
    ],
  },
  {
    question: "How accurate are your AI agents?",
    answer:
      "Our AI agents achieve very high accuracy rates: EVA has 98%+ accuracy in eligibility verification, CAM achieves 95%+ clean claim rates, and PHIL has 99%+ accuracy in payment posting. These rates typically exceed manual processing accuracy. We continuously monitor and improve our agents' performance.",
    category: "performance",
    alternativeQuestions: [
      "What is your error rate?",
      "How reliable are your agents?",
      "Do your agents make mistakes?",
    ],
  },
  {
    question: "What support do you provide?",
    answer:
      "We provide comprehensive support including 24/7 technical assistance, regular updates and improvements, dedicated account management, and ongoing training. Our support team is available via email, phone, and chat to address any questions or issues that arise.",
    category: "support",
    alternativeQuestions: [
      "Do you offer customer support?",
      "What happens if I need help?",
      "Is there technical support?",
    ],
  },
  {
    question: "How long does implementation take?",
    answer:
      "Typical implementation takes 4-6 weeks, depending on your organization's size and complexity. This includes integration with your existing systems, configuration, testing, and training. We use a phased approach to minimize disruption and ensure a smooth transition.",
    category: "onboarding",
    alternativeQuestions: [
      "How quickly can we deploy?",
      "What's the implementation timeline?",
      "How soon can we go live?",
    ],
  },
  {
    question: "Can I see a demo of Thoughtful AI?",
    answer:
      "Yes, we'd be happy to provide a demo of our AI agents. Contact our sales team at sales@thoughtful.ai or call 1-800-THOUGHTFUL to schedule a personalized demonstration. We can show you how our agents handle your specific workflows and answer any questions you may have.",
    category: "sales",
    alternativeQuestions: ["I want to see how it works", "Can I try before buying?", "Show me a demonstration"],
  },
  {
    question: "How do you handle claim denials?",
    answer:
      "CAM, our Claims Agent Manager, includes denial management capabilities. It automatically identifies the reason for denials, suggests corrections, and can resubmit corrected claims. It also analyzes denial patterns to help prevent future denials. This proactive approach typically reduces denial rates by 30-50%.",
    category: "claims_processing",
    alternativeQuestions: ["What about denied claims?", "How do you manage denials?", "Can you reduce our denials?"],
  },
  {
    question: "How do you handle underpayments?",
    answer:
      "PHIL, our Payment Handling Intelligence Layer, automatically identifies underpayments by comparing payments to contracted rates. It can generate appeal letters for underpaid claims and track the appeal process. This typically results in a 15-25% increase in collections from previously underpaid claims.",
    category: "payment_posting",
    alternativeQuestions: [
      "What if we're not paid correctly?",
      "How do you identify underpayments?",
      "Can you help with payment accuracy?",
    ],
  },
  {
    question: "Do you offer training for our staff?",
    answer:
      "Yes, we provide comprehensive training for your staff as part of the implementation process. This includes system training, workflow integration, and best practices. We also offer ongoing training for new staff and refresher courses as needed. Our goal is to ensure your team can maximize the benefits of our AI agents.",
    category: "onboarding",
    alternativeQuestions: ["How will our staff learn to use this?", "Is training included?", "Do you teach our team?"],
  },
  {
    question: "What makes Thoughtful AI different from competitors?",
    answer:
      "Thoughtful AI stands out through our specialized focus on healthcare revenue cycle, end-to-end automation (not just point solutions), advanced AI technology that continuously improves, seamless integration with existing systems, and our outcomes-based approach. Our clients typically see 30-50% cost reduction and 15-25% revenue improvement.",
    category: "general",
    alternativeQuestions: [
      "Why choose Thoughtful AI?",
      "How do you compare to other solutions?",
      "What's your competitive advantage?",
    ],
  },
  {
    question: "How do you measure success?",
    answer:
      "We measure success through key performance indicators including cost reduction, revenue improvement, denial rate reduction, days in A/R, clean claim rate, and staff productivity. We provide regular reports on these metrics and work with you to continuously improve outcomes. Our goal is to deliver measurable ROI within 3-6 months.",
    category: "performance",
    alternativeQuestions: ["What metrics do you track?", "How do I know it's working?", "What results can I expect?"],
  },
  {
    question: "Can Thoughtful AI handle our volume?",
    answer:
      "Yes, Thoughtful AI is designed to scale with your needs. Our platform successfully serves organizations ranging from small practices to large health systems processing millions of transactions monthly. The cloud-based architecture automatically scales to handle peak volumes without performance degradation.",
    category: "performance",
    alternativeQuestions: [
      "Will this work for our size?",
      "Can you handle large volumes?",
      "Is this scalable for our organization?",
    ],
  },
]
