import { useEffect, useState, useRef } from 'react';
import {  m  } from 'framer-motion';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const header = document.querySelector('nav');
      const footer = document.querySelector('footer');
      
      if (header && header.contains(e.target)) {
        setShowCursor(true);
      } else if (footer && footer.contains(e.target)) {
        setShowCursor(true);
      } else {
        setShowCursor(false);
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!showCursor) return null;

  return (
    <m.div
      className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
      animate={{
        x: position.x + 15,
        y: position.y + 15,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <m.div
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2,
        }}
        className="text-3xl"
      >
        🧑‍�
      </m.div>
    </m.div>
  );
};

export default CursorFollower;
