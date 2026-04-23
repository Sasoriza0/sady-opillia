'use client'

import "./globals.css"
import Header from "../components/Header"
import Footer from "../components/Footer" 
import { BasketProvider } from '../context/BasketContext'
import { ToastContainer } from 'react-toastify'
import { usePathname } from 'next/navigation'


export default function RootLayout({ children }) {

  const pathname = usePathname()
  const noLayoutPages = ['/sady_opillia/adminpanel', '/sady_opillia/adminpanel/login'] 

  if (noLayoutPages.includes(pathname)) {
    return (
      <html lang="uk">
        <body className="antialiased bg-gray-200 min-h-screen">
          <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} limit={6} stacked style={{ zIndex: 9999 }} />
          <BasketProvider>
            <main className="container flex-grow z-10">
              {children}
            </main>
          </BasketProvider>
        </body>
      </html>
    )
  }
  
  return (
    <html lang="uk">
      <body className={`antialiased min-h-screen flex flex-col`}>
        <ToastContainer position="top-center" autoClose={2000} pauseOnHover={false} limit={6} stacked style={{ zIndex: 9999 }} />
        <BasketProvider>
          <div className="wrapper bg-gray-200 flex flex-col flex-grow">
            <Header/>
            <main className="container flex-grow z-10">
              {children}
            </main>
            <Footer/>
            <div className="bg-[url('/img/branch.svg')] absolute bottom-0 left-0 bg-no-repeat w-1/4 h-1/4 z-0" style={{ backgroundPosition: '-5px 0' }}></div>
          </div>
        </BasketProvider>
      </body>
    </html>
  )
}