import { Outlet, useNavigate } from "react-router-dom"
import styles from "./styles.module.css"
import useSoundQueueStore from "../shared/api/player"

const Layout = () => {
      const navigate = useNavigate() 
      const {clear} = useSoundQueueStore()
      const onClick = (to) => {
            navigate(to)
            clear()
      }
      return (
            <div className={styles.layout}>
                  <header className={styles.header}>
                        <div className={styles.logo} onClick={() => onClick("/")}>Maestro, play!</div>
                        <div className={styles.nav}>
                              <p onClick={() => onClick("/")}>Home</p>
                        </div>
                  </header>
                  <Outlet />
                  <footer className={styles.footer}>
                        <a href="https://github.com/AbuZhuma">github</a>
                  </footer>
            </div>
      )
}

export default Layout
