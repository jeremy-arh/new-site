import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Function to observe all animated elements
    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        '.scroll-fade-in, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right'
      );

      animatedElements.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          intersectionObserver.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Set up a MutationObserver to watch for new elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    // Observe changes in the entire document
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
