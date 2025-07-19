import { memo, useEffect, useState } from 'react';
import styles from "./styles.module.css";
import useSoundQueueStore from '../api/player';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
let defaultColor = "#363636";

const OneDrop = ({ drop }) => {
  const [color, setColor] = useState(defaultColor);
  const { addQ, activeSounds } = useSoundQueueStore();
  const sound = drop.sound;
  let time = null;

  const isActive = Array.from(activeSounds.values()).includes(drop.key);

  useEffect(() => {
    setColor(isActive ? drop.color : defaultColor);
  }, [isActive, drop.color]);

  const play = () => {
    if (time) clearTimeout(time);
    setColor(drop.color);
    sound.dropKey = drop.key;
    addQ(Date.now(), sound);
    sound.play();
    time = setTimeout(() => {
      setColor(defaultColor);
    }, sound._duration);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === drop.key.toLowerCase()) {
        play();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drop.key, sound]);

  return (
    <button
      className={styles.drop}
      style={{
        background: color,
        boxShadow: color !== defaultColor ? `0 4px 12px ${hexToRgba(drop.color, 0.4)}` : 'none'
      }}
      onClick={play}
    >
      {color !== defaultColor ? "" :drop.key}
    </button>
  );
};

export default memo(OneDrop);