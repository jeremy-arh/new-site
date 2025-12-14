import { Icon } from '@iconify/react';
import { useTranslation } from '../hooks/useTranslation';
import { IMAGES } from '../utils/imageProxy';

const ChatCTA = () => {
  const { t, language } = useTranslation();

  // Ouvrir le chat Crisp
  const openCrispChat = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    } else {
      // Si Crisp n'est pas encore chargé, attendre un peu
      setTimeout(() => {
        if (window.$crisp) {
          window.$crisp.push(['do', 'chat:open']);
        }
      }, 500);
    }
  };

  const translations = {
    en: {
      title: 'Need help with a complex case?',
      text: 'Our expert team is here to help you navigate even the most complex notarization challenges. Whether you have multiple documents, special requirements, or unique circumstances, we\'re ready to assist you with personalized solutions.',
      buttonText: 'Start a conversation'
    },
    fr: {
      title: 'Besoin d\'aide pour un cas complexe ?',
      text: 'Notre équipe d\'experts est là pour vous aider à naviguer même dans les défis de notarisation les plus complexes. Que vous ayez plusieurs documents, des exigences spéciales ou des circonstances uniques, nous sommes prêts à vous assister avec des solutions personnalisées.',
      buttonText: 'Démarrer une conversation'
    },
    es: {
      title: '¿Necesitas ayuda con un caso complejo?',
      text: 'Nuestro equipo de expertos está aquí para ayudarte a navegar incluso los desafíos de notarización más complejos. Ya sea que tengas múltiples documentos, requisitos especiales o circunstancias únicas, estamos listos para asistirte con soluciones personalizadas.',
      buttonText: 'Iniciar conversación'
    },
    de: {
      title: 'Brauchen Sie Hilfe bei einem komplexen Fall?',
      text: 'Unser Expertenteam ist hier, um Ihnen bei der Bewältigung selbst der komplexesten Notarisierungsherausforderungen zu helfen. Ob Sie mehrere Dokumente haben, besondere Anforderungen oder einzigartige Umstände, wir sind bereit, Ihnen mit personalisierten Lösungen zu helfen.',
      buttonText: 'Gespräch beginnen'
    },
    it: {
      title: 'Hai bisogno di aiuto con un caso complesso?',
      text: 'Il nostro team di esperti è qui per aiutarti a navigare anche le sfide di notarizzazione più complesse. Che tu abbia più documenti, requisiti speciali o circostanze uniche, siamo pronti ad assisterti con soluzioni personalizzate.',
      buttonText: 'Inizia una conversazione'
    },
    pt: {
      title: 'Precisa de ajuda com um caso complexo?',
      text: 'Nossa equipe de especialistas está aqui para ajudá-lo a navegar mesmo nos desafios de notarização mais complexos. Seja você tenha vários documentos, requisitos especiais ou circunstâncias únicas, estamos prontos para ajudá-lo com soluções personalizadas.',
      buttonText: 'Iniciar conversa'
    }
  };

  const content = translations[language] || translations.en;

  return (
    <section className="py-12 px-4 sm:px-[30px] bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col items-center justify-center text-center rounded-2xl bg-gray-50 border border-gray-200 py-8 px-6">
          <div className="relative mb-6">
            <img
              src={IMAGES.CHAT_AVATAR}
              alt="Agent support"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
            {/* Point vert pour indiquer "en ligne" */}
            <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse">
              <span className="absolute inset-0 bg-green-500 rounded-full animate-ping"></span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            {content.title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-2xl line-clamp-3">
            {content.text}
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-200 shadow-md"
            onClick={openCrispChat}
          >
            <Icon icon="mdi:chat-outline" className="w-5 h-5" />
            <span>{content.buttonText}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatCTA;

