import { useEffect } from 'react';

export const useScrollToTop = (dependencies = []) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, dependencies);
}; 