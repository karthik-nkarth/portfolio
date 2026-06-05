import { useEffect, useState } from 'react';
import {  m  } from 'framer-motion';

const ShootingStar = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const createShootingStar = () => {
      const startSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let startX, startY, endX, endY, angle;

      switch (startSide) {
        case 0: // top
          startX = Math.random() * window.innerWidth;
          startY = -50;
          endX = startX + (Math.random() * 400 + 200) * (Math.random() > 0.5 ? 1 : -1);
          endY = window.innerHeight + 50;
          angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
          break;
        case 1: // right
          startX = window.innerWidth + 50;
          startY = Math.random() * window.innerHeight;
          endX = -50;
          endY = startY + (Math.random() * 400 + 200) * (Math.random() > 0.5 ? 1 : -1);
          angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
          break;
        case 2: // bottom
          startX = Math.random() * window.innerWidth;
          startY = window.innerHeight + 50;
          endX = startX + (Math.random() * 400 + 200) * (Math.random() > 0.5 ? 1 : -1);
          endY = -50;
          angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
          break;
        case 3: // left
          startX = -50;
          startY = Math.random() * window.innerHeight;
          endX = window.innerWidth + 50;
          endY = startY + (Math.random() * 400 + 200) * (Math.random() > 0.5 ? 1 : -1);
          angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
          break;
      }

      const star = {
        id: Date.now(),
        startX,
        startY,
        endX,
        endY,
        angle,
      };
      setStars((prev) => [...prev, star]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== star.id));
      }, 2000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        createShootingStar();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 dark:opacity-100 opacity-0 transition-opacity duration-1000">
      {stars.map((star) => (
        <m.div
          key={star.id}
          initial={{ x: star.startX, y: star.startY, opacity: 1, scale: 0 }}
          animate={{
            x: star.endX,
            y: star.endY,
            opacity: 0,
            scale: 1,
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute"
          style={{
            transform: `rotate(${star.angle}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <div className="relative">
            {/* Shooting star head - just a shining star */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_4px_rgba(255,255,255,0.9)] animate-pulse" />
          </div>
        </m.div>
      ))}
    </div>
  );
};

export default ShootingStar;
