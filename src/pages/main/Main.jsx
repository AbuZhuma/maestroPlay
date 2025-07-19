import { useEffect } from "react"
import useDropBox from "../../shared/api/dropbox"
import CollectionsList from "../../widgets/collections/CollectionsList"
import styles from "./styles.module.css"

const Main = () => {
      const { collections, getCollections } = useDropBox()
      useEffect(() => {
            getCollections()
            Howler.autoUnlock = true;
            Howler.autoSuspend = false;
      }, [])
      return (
            <div className={styles.main}>
                  <div className={styles.cols}>
                        <p>Choose collection</p>
                        {collections.length ?
                              <CollectionsList collections={collections} />
                              : null}
                  </div>
            </div>
      )
}

export default Main
