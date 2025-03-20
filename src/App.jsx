import './App.css'
import Header from './components/Header'
import LoginRegister from './components/LoginRegister'
import Footer from './components/Footer'
import Properties from './components/Properties'
import Admin from './pages/Admin'
import Owner from './pages/Owner'

import Customer from './pages/Customer'

import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Header />
      <div className="pt-24 pb-10 px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto min-h-[90vh]">
        <Routes>
          {/*<Route path="/" element={
            <>
              <Search />
              <Filter />
              <Properties />
              <Pagination />
            </>
          } />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile />} />*/}
          <Route path="/" element={<Properties />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/owner" element={<Owner />} />
        </Routes>
      </div >
      <Footer />
    </>
  )
}

export default App
