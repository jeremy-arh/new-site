import { useState, useMemo } from 'react';
import { fuzzySearchFAQs } from '../utils/fuzzySearch';

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
    },
    {
      question: 'Can I track the status of my certification?',
      answer: 'Yes, you\'ll receive real-time updates via email and can track your document status in your account dashboard throughout the entire process.'
    },
    {
      question: 'Do I need to schedule an appointment in advance?',
      answer: 'Yes, you can book your video appointment online. We offer flexible time slots, including same-day appointments based on availability.'
    },
    {
      question: 'What happens if I miss my scheduled appointment?',
      answer: 'You can reschedule up to 24 hours before your appointment at no extra charge. Late cancellations may incur a rescheduling fee.'
    },
    {
      question: 'What do I need for the video appointment?',
      answer: 'You\'ll need a computer or smartphone with camera/microphone, stable internet connection, valid government-issued ID, and your original documents.'
    },
    {
      question: 'Can I use my phone for the video certification?',
      answer: 'Absolutely! Our platform works on smartphones, tablets, and computers. We recommend a stable WiFi connection for the best experience.'
    },
    {
      question: 'What if my documents are not in English?',
      answer: 'We can certify documents in any language. For certified translations, we also offer translation services to complement your certification.'
    },
    {
      question: 'Will my certified documents be accepted for immigration purposes?',
      answer: 'Yes, our certifications are performed by licensed notaries and are accepted by USCIS, embassies, and immigration authorities worldwide.'
    },
    {
      question: 'Do you provide apostille services as well?',
      answer: 'Yes! After certification, we can assist with obtaining apostilles through the State Department for international document authentication.'
    },
    {
      question: 'What\'s the difference between certification and apostille?',
      answer: 'Certification confirms document authenticity. An apostille is an additional authentication required for documents used in countries that signed the Hague Convention.'
    },
    {
      question: 'What if my document gets rejected by the receiving authority?',
      answer: 'We offer a 100% acceptance guarantee. If your properly certified document is rejected due to our error, we\'ll redo it free or provide a full refund.'
    }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Recherche floue dans les FAQs
  const filteredFAQs = useMemo(() => {
    return fuzzySearchFAQs(faqs, searchQuery);
  }, [searchQuery]);

  // Ouvrir le chat Crisp
  const openCrispChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  return (
    <section id="faq" className="py-20 px-[30px] bg-gray-50 overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-semibold mb-4 scroll-fade-in">
            Frequently Asked Questions
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null); // Fermer les FAQs ouvertes lors de la recherche
              }}
              placeholder="Search for questions or answers..."
              className="w-full px-6 py-4 pl-14 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 transition-all duration-300 text-base placeholder-gray-400"
            />
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setOpenIndex(null);
                }}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Message si aucun résultat */}
        {searchQuery && filteredFAQs.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any FAQs matching your search. Our team is here to help!
              </p>
              <button
                onClick={openCrispChat}
                className="inline-block px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                Contact us
              </button>
            </div>
          </div>
        )}

        {/* Liste des FAQs filtrées */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, displayIndex) => {
            const originalIndex = faq.originalIndex;
            return (
            <div
              key={`faq-${originalIndex}-${displayIndex}`}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 scroll-slide-up"
            >
              <button
                onClick={() => toggleFAQ(originalIndex)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all duration-300 group"
              >
                <span className="text-lg font-bold text-gray-900 pr-4 transition-all">{faq.question}</span>
                <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 flex-shrink-0 ${
                  openIndex === originalIndex ? 'rotate-180' : ''
                }`}>
                  <svg
                    className={`w-5 h-5 ${openIndex === originalIndex ? '' : 'text-gray-900'}`}
                    fill={openIndex === originalIndex ? "url(#faq-gradient)" : "currentColor"}
                    viewBox="0 0 16 16"
                  >
                    <defs>
                      <linearGradient id="faq-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#491AE9" />
                        <stop offset="33%" stopColor="#D414E5" />
                        <stop offset="66%" stopColor="#FC03A1" />
                        <stop offset="100%" stopColor="#FF7715" />
                      </linearGradient>
                    </defs>
                    <path d="M8.00045 8.78092L11.3003 5.48111L12.2431 6.42392L8.00045 10.6666L3.75781 6.42392L4.70063 5.48111L8.00045 8.78092Z" />
                  </svg>
                </div>
              </button>

              {openIndex === originalIndex && (
                <div className="px-6 pb-5 animate-slide-up">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
