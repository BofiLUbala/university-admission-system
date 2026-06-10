import { useState, useEffect, useRef } from 'react';

const CyclingImage = ({ images, alt, duration = 4000, className = '' }) => {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!images || images.length < 2) return;
    timerRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setVisible(true);
      }, 400);
    }, duration);
    return () => clearInterval(timerRef.current);
  }, [images, duration]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-neutral-200 ${className}`}>
      <img
        src={images[current]}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default CyclingImage;