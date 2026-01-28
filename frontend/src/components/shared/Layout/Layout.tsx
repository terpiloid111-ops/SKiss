import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
