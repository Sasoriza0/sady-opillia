'use client'

import useAdminAuth from "@/app/hooks/useAdminAuth"
import Loading from "@/app/components/Loading"
import { useState } from 'react'
import OrdersComponent from "@/app/components/Orders" 
import ProductsComponent from "@/app/components/Products"

const AdminPage = () => {
  const isLoading = useAdminAuth()
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="min-h-screen bg-white flex shadow-2xl">
          <aside className="w-64 bg-white p-4 shadow-md">
            <h1 className="text-xl font-bold mb-4">Адмінпанель</h1>
            <nav>
              <ul>
                <li>
                  <button
                    className={`w-full text-left p-2 rounded-md ${activeTab === 'products' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('products')}
                  >
                    Товари
                  </button>
                </li>
                <li className="mt-2">
                  <button
                    className={`w-full text-left p-2 rounded-md ${activeTab === 'orders' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    Замовлення
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-6">
            {activeTab === 'products' ? <Products /> : <OrdersComponent />}
          </main>
        </div>
      )}
    </div>
  )
}

function Products() {
  return <ProductsComponent />
}

export default AdminPage
