import React, { useEffect, useState } from 'react';
import KeyboardArrowUpTwoToneIcon from '@material-ui/icons/KeyboardArrowUpTwoTone';
import './ScrollToTop.css';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () =>
      window.pageYOffset > 200 ? setIsVisible(true) : setIsVisible(false);

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return isVisible ? (
    <div className="scroll-top">
      <a href="#top">
        <KeyboardArrowUpTwoToneIcon fontSize="large" />
      </a>
    </div>
  ) : null;
}
