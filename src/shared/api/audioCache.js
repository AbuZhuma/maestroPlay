// audioCache.js - отдельный модуль для управления аудио кешем
let audioContext;
const audioBuffersCache = new Map();

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Восстанавливаем контекст если он был приостановлен (автополитика браузеров)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
  return audioContext;
};

export const getAudioBuffer = async (url) => {
  if (audioBuffersCache.has(url)) {
    return audioBuffersCache.get(url);
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);
    audioBuffersCache.set(url, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio:', error);
    return null;
  }
};

export const preloadAudio = (urls) => {
  return Promise.all(urls.map(url => getAudioBuffer(url)));
};