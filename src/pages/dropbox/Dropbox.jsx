import { useParams } from "react-router-dom"
import useDropBox from "../../shared/api/dropbox"
import Dropgrid from "../../widgets/dropgrid/Dropgrid"
import styles from "./styles.module.css"
import { useEffect } from "react"

const Dropbox = () => {
      const param = useParams()
      const {getCollection, one} = useDropBox()
      useEffect(() => {
            getCollection(param.collection)
      }, [])      
      return (
            <div className={styles.main}>
                 {one ? <Dropgrid drops={one.drops}/> : null}
            </div>
      )
}

export default Dropbox
