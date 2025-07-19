import { useEffect, useState, useMemo } from "react";
import OneDrop from "../../shared/onedrop/OneDrop";
import styles from "./styles.module.css";
import { Howl } from 'howler';
import { url } from "../../shared/api/vars";
import useSoundQueueStore from "../../shared/api/player";

const soundCache = new Map();

const Dropgrid = ({ drops }) => {
  const [loading, setLoading] = useState(true);
  const [curDrops, setCurDrops] = useState(drops);
  const { start, stop, play, endTime, startTime } = useSoundQueueStore();
  useEffect(() => {
    let isMounted = true;
    const loadSounds = async () => {
      const newDrops = await Promise.all(
        drops.map(async (el) => {
          const cacheKey = url + el.src;
          if (soundCache.has(cacheKey)) {
            return { ...el, sound: soundCache.get(cacheKey) };
          }
          return new Promise((resolve) => {
            const sound = new Howl({
              src: [cacheKey],
              volume: 0.7,
              preload: true,
              html5: true,
              onload: function () {
                this._duration = Math.round(this.duration() * 1000);
                soundCache.set(cacheKey, sound);
                if (isMounted) {
                  resolve({ ...el, sound });
                }
              },
              onloaderror: function () {
                console.error('Failed to load sound:', cacheKey);
                if (isMounted) {
                  resolve({ ...el, sound: null });
                }
              }
            });
          });
        })
      );

      if (isMounted) {
        setCurDrops(newDrops);
        setLoading(false);
      }
    };

    loadSounds();

    return () => {
      isMounted = false;
    };
  }, [drops]);
  const memoizedDrops = useMemo(() => curDrops, [curDrops]);

  const onPlay = () => {
    play()
  }

  if (loading) return <p>Loading...</p>;
  if (!memoizedDrops.length) return <p>No drops here</p>
  return (
    <div className={styles.list}>
      <div className={styles.pannel}>
        <div className={styles.btns}>
          {!startTime && !endTime ? <button onClick={() => start()}>start</button> : null}
          {startTime && !endTime ? <button onClick={() => stop()}>stop</button> : null}
          {endTime ?(
            <>
            <button onClick={() => start()}>new</button>
            <button onClick={onPlay}>play</button>
            {/* <button onClick={onPlay}>save</button> */}
            </>
          ) : null}
        </div>
        <div className={styles.events}>
          <p className={styles.log}>{!startTime && !endTime ? "not recording" : startTime && !endTime ? "recording..." : endTime ? "recorded" : ""}</p>
        </div>
      </div>
      <div className={styles.drops}>
        {memoizedDrops.map((el, i) => (
          <OneDrop key={`${el.src}-${i}`} drop={el} />
        ))}
      </div>
    </div>
  );
};

export default Dropgrid;