import { useState, useEffect } from 'react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Extract H2 headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');

    const headingsList = Array.from(h2Elements).map((h2, index) => {
      const text = h2.textContent;
      const id = `heading-${index}`;
      return { id, text };
    });

    setHeadings(headingsList);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all h2 elements with IDs
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update active state immediately for better UX
      setActiveId(id);
    }
  };

  return (
    <aside className="hidden lg:block sticky top-32 h-fit">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
          Table of Contents
        </h3>
        <nav>
          <ul className="space-y-3">
            {headings.map(({ id, text }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToHeading(id)}
                  className={`text-left text-sm transition-all duration-200 hover:text-black ${
                    activeId === id
                      ? 'text-black font-semibold border-l-2 border-black pl-3'
                      : 'text-gray-600 border-l-2 border-transparent pl-3'
                  }`}
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default TableOfContents;
