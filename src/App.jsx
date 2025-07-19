import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Dropbox from './pages/dropbox/Dropbox'
import Layout from './layout/Layout'
import Admin from './pages/admin/Admin'
import Main from './pages/main/Main'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Main />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/:collection' element={<Dropbox />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
