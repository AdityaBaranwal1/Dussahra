import { useRef, useState, useEffect } from 'react';

/**
 * Returns a ref + boolean indicating whether the element is in the viewport.
 * Used to pause expensive animations (canvas RAF, CSS infinite, setInterval)
 * when the user has scrolled past them.
 */
export function useVisibility<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? '100px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return { ref, isVisible };
}
