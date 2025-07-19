import { useNavigate } from "react-router-dom"
import styles from "./styles.module.css"

const CollectionsList = ({collections=[]}) => {
      const navigate = useNavigate()
      return (
            <div className={styles.list}>
                  {collections.map((el) => {
                        return (
                              <div onClick={() => navigate(`/${el}`)} className={styles.one}>{el}</div>
                        )
                  })}
            </div>
      )
}

export default CollectionsList
