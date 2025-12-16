import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What can Bliss do?",
      answer: "Ash provides emotional wellbeing support through conversations over text or voice-chat. Ash remembers what you say, provides insights on your experience, challenges you when appropriate, and creates a plan for your journey."
    },
    {
      question: "Is Bliss a replacement for professional help?",
      answer: "Ash isn't designed to treat, track or diagnose disorders or as a replacement for professional help. If you need more support than what Ash can provide, we encourage you to reach out to a professional. Ash also isn’t built for crisis situations - if you are in an emergency or crisis situation, please reach out to 988 or a local support service. Ash cannot, and does not intend to, provide medical advice or diagnosis. Interaction with Ash does not constitute a medical professional-patient relationship. Please do not avoid or delay medical attention as a result of a statement from Ash."
    },
    {
      question: "Is Bliss appropriate for all ages?",
      answer: "Ash is designed for adults (18+) seeking thoughtful, accessible, emotional wellbeing support, especially those navigating everyday life transitions, stresses, worries or relationship changes. If you need medical treatment or advice on your mental health, please seek professional help."
    },
    {
      question: "Is Bliss safe and private?",
      answer: "We take privacy incredibly seriously. We want you to feel safe to be yourself, and express yourself fully. Your conversations remain private unless you choose to share them anonymously to help make Ash better for everyone. "
    },
    
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl md:text-5xl font-bold text-amber-100 text-center mb-16">
          FAQs
        </h1>

        {/* Accordion Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-amber-100 bg-opacity-60 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-200"
            >
              {/* Question */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white hover:bg-opacity-40 transition-colors"
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-700 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-700" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}