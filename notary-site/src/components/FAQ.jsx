import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does the online notarization process work?',
      answer: 'Everything happens in just a few minutes, directly from your browser. You schedule a secure video session with a licensed notary, sign your document remotely, and the notarization is completed in real time. Your notarized document is immediately uploaded and available on the platform, accompanied by its digital certification.'
    },
    {
      question: 'Are my documents officially recognized internationally?',
      answer: 'Yes. All documents notarized through our platform can receive an apostille issued in accordance with The Hague Convention of 5 October 1961. This apostille certifies the authenticity of the notary\'s signature and seal, ensuring the international validity of your document across all member countries.'
    },
    {
      question: 'What types of documents can I have certified?',
      answer: 'You can notarize and certify a wide range of documents, including:\n- Contracts, declarations, affidavits, and simple powers of attorney\n- Certified true copies (IDs, diplomas, certificates)\n- Certified translations Business and administrative documents\nEach document is securely signed, sealed, and stored within your private space.'
    },
    {
      question: 'How is my data protected?',
      answer: 'All transfers are end-to-end encrypted (AES-256) and stored on secure servers that comply with international data protection standards. Video sessions are recorded and archived under strict control to ensure integrity, traceability, and full confidentiality for every notarization.'
    },
    {
      question: 'When will I receive my final document?',
      answer: 'Immediately after the video session, your notarized document is automatically uploaded to your secure dashboard. If an apostille is required, it is added once validated by the competent authority — and the final certified document becomes available for instant download.'
    },
    {
      question: 'What is The Hague Convention?',
      answer: 'The Hague Convention of 5 October 1961 simplifies the international recognition of public documents. It replaces lengthy consular legalizations with a single apostille, issued by an authorized authority. Thanks to this convention, notarized and apostilled documents from our platform are valid in more than 120 countries worldwide.'
    },
    {
      question: 'What is the legal value of my documents?',
      answer: 'Each document is digitally signed and sealed by a licensed notary and comes with an authenticity certificate compliant with international standards. When an apostille is added, it officially confirms the validity of the signature and seal — giving your document the same legal value as one signed in person.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-[30px] bg-gray-50 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            Frequently Asked Questions
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 scroll-slide-up"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-300 group"
              >
                <span className="text-lg font-bold text-gray-900 pr-4 transition-all">{faq.question}</span>
                <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.00045 8.78092L11.3003 5.48111L12.2431 6.42392L8.00045 10.6666L3.75781 6.42392L4.70063 5.48111L8.00045 8.78092Z" />
                  </svg>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 animate-slide-up">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
