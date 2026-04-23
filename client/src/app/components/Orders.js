'use client'

import { useState } from 'react'
import useFetchOrders from "@/app/hooks/useFetchOrders"

const BASE_URL = 'http://localhost:4000/api'
const STATUS_TABS = ['new', 'processing', 'sent', 'completed', 'canceled'] 
const STATUS_LABELS = {
  new: 'Нові',
  processing: 'Обробляються',
  sent: 'Відправлені',
  completed: 'Виконані',
  canceled: 'Скасовані'
}

const Orders = () => {
  const { orders, isLoading, error, setOrders } = useFetchOrders()
  const [activeTab, setActiveTab] = useState('new') // Статус за замовчуванням

  const updateStatus = async (orderId, newStatus) => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const res = await fetch(`${BASE_URL}/order/update/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Не вдалося оновити статус замовлення')

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
    } catch (err) {
      alert(err.message)
    }
  }

  if (isLoading) return <p className="text-gray-600">Завантаження замовлень...</p>
  if (error) return <p className="text-red-500">Помилка: {error.message}</p>

  const filteredOrders = orders.filter(order => order.status === activeTab)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Усі замовлення</h2>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            className={`px-5 py-2 text-lg font-semibold rounded-xl transition duration-200 ${
              activeTab === status ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab(status)}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <ul className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <li key={order._id} className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
              <p className="text-sm text-gray-500 mb-2">ID: {order._id}</p>
              <p className="text-lg font-semibold mb-1">
                ПІБ: {order.lastName} {order.firstName} {order.midleName}
              </p>
              <p className="mb-1">📞 Телефон: {order.phone}</p>
              <p className="mb-1">🏠 Адреса:
                {order.address?.[0]
                  ? ` ${order.address[0].area}, ${order.address[0].city}, ${order.address[0].warehouse}`
                  : ' Адресу не вказано'}
              </p>
              <p className="mb-1">💳 Метод оплати: {order.paymentMethod}</p>
              <p className="mb-4 font-medium text-lg">💰 Загальна ціна: {order.totalPrice} грн</p>

              <div className="mb-4">
                <p className="font-semibold mb-2">🛒 Товари:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {order.goods.map((good, index) => (
                    <li key={index}>
                      {good.item?.name || 'Невідомий товар'} — {good.count} шт
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {order.status !== 'canceled' && (
                  <>
                    {/* Виводимо кнопку для переходу до наступного статусу */}
                    {order.status === 'new' && (
                      <button
                        onClick={() => updateStatus(order._id, 'processing')}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm"
                      >
                        Обробити
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => updateStatus(order._id, 'sent')}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm"
                      >
                        Відправити
                      </button>
                    )}
                    {order.status === 'sent' && (
                      <button
                        onClick={() => updateStatus(order._id, 'completed')}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm"
                      >
                        Завершити
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <button
                        onClick={() => updateStatus(order._id, 'completed')}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm"
                        disabled
                      >
                        Завершено
                      </button>
                    )}
                  </>
                )}

                {/* Кнопка скасування, яка не відображається для виконаних замовлень */}
                {order.status !== 'canceled' && order.status !== 'completed' && (
                  <button
                    onClick={() => updateStatus(order._id, 'canceled')}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm"
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Немає замовлень для цього статусу</p>
        )}
      </ul>
    </div>
  )
}

export default Orders
