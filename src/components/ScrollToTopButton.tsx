import { useState, useEffect } from 'react'
import arrowUp from '../../public/assets/arrowUp.png'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <img src={arrowUp} alt="Scroll to top" style={{ width: '50px', height: '50px' }} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
