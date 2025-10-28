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

    const observeAnimatedElements = () => {
      const animatedElements = document.querySelectorAll(
        '.scroll-fade-in, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right'
      );

      animatedElements.forEach((el) => {
        if (!el.dataset.scrollObserved) {
          intersectionObserver.observe(el);
          el.dataset.scrollObserved = 'true';
        }
      });
    };

    // Observe existing animated elements
    observeAnimatedElements();

    // Watch for dynamically added animated elements (e.g., after data fetches)
    const mutationObserver = new MutationObserver(() => {
      observeAnimatedElements();
    });

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
