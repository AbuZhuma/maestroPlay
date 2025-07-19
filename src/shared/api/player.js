import { create } from 'zustand';

const useSoundQueueStore = create((set, get) => ({
      queue: new Map(),
      startTime: 0,
      endTime: 0,
      activeSounds: new Map(), 
      addQ: (key, value) => {
            const queue = new Map(get().queue);
            if (queue.has(key)) {
                  queue.set(key, [...queue.get(key), value]);
            } else {
                  queue.set(key, [value]);
            }
            set({ queue });
      },
      clear: () => {
            set({ queue: new Map(), activeSounds: new Map() });
      },
      start: () => {
            set({
                  queue: new Map(),
                  activeSounds: new Map(),
                  startTime: Date.now(),
                  endTime: 0
            });
      },
      stop: () => {
            set({ endTime: Date.now() });
      },

      play: () => {
            const { queue, startTime, endTime } = get();
            playSoundsByTimestamps(Array.from(queue), startTime, endTime);
      },

      addActiveSound: (key, dropKey, dur) => {
            const activeSounds = new Map(get().activeSounds);
            activeSounds.set(key, dropKey);
            set({ activeSounds });

            setTimeout(() => {
                  get().removeActiveSound(key, dropKey);
            }, dur);
      },

      removeActiveSound: (key, dropKey) => {
            const activeSounds = new Map(get().activeSounds);
            activeSounds.delete(key);
            set({ activeSounds });
      }
}));

function playSoundsByTimestamps(soundData, startTime, endTime) {
      if (startTime >= endTime) return;

      const store = useSoundQueueStore.getState();

      const soundsToPlay = soundData.filter(([timestamp]) =>
            timestamp >= startTime && timestamp <= endTime
      );

      soundsToPlay.forEach(([timestamp, soundArray]) => {
            const delay = timestamp - startTime;
            soundArray.forEach(sound => {
                  setTimeout(() => {
                        if (sound.play) {
                              sound.play();
                              store.addActiveSound(timestamp, sound.dropKey, sound._duration); // Предполагаем, что sound имеет dropKey
                        }
                  }, delay);
            });
      });
}

export default useSoundQueueStore;