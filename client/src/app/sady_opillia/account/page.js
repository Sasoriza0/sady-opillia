'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const UserProfilePage = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      setMessage('Ви не авторизовані')
      router.push('/sady_opillia/login')
      return
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/user/info', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Помилка при отриманні даних користувача')

        console.log('User data:', data)
        setUser(data.user || data)
        setOrders(data.orders || [])
      } catch (err) {
        setMessage(err.message)
      }
    }

    fetchUserData()
  }, [router])

  // Функція для відображення статусу
  const getStatusLabel = (status) => {
    switch (status) {
      case 'new':
        return <span className="text-yellow-500 font-bold">Оформлено</span>
      case 'processing':
        return <span className="text-blue-500 font-bold">Обробляється</span>
      case 'sent':
        return <span className="text-orange-500 font-bold">Відправлено</span>
      case 'completed':
        return <span className="text-green font-bold">Виконано</span>
      case 'canceled':
        return <span className="text-red-500 font-bold">Скасовано</span>
      default:
        return <span className="text-gray-500">Невідомий статус</span>
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-green">Кабінет користувача</h2>

        {message && <p className="text-center text-sm text-red-600">{message}</p>}

        {user && (
          <div>
            <h3 className="text-lg font-bold mb-1">Ім’я: {user.firstName}</h3>
            <p>Email: {user.email}</p>
            <p>Телефон: {user.phone || 'не вказано'}</p>

            <div className="mt-6">
              <button
                onClick={() => router.push('/sady_opillia/account/edit')}
                className="w-full bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition"
              >
                Редагувати профіль
              </button>
              <button
                onClick={() => router.push('/sady_opillia/forgot-password')}
                className="w-full mt-4 bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition"
              >
                Змінити пароль
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userToken')
                  window.location.href = '/sady_opillia'
                }}
                className="w-full mt-4 bg-red-500 text-white p-2 rounded hover:bg-white hover:text-red-500 border-2 border-red-500 transition"
              >
                Вийти з акаунту
              </button>
            </div>

            <div className="mt-10">
              <h4 className="text-xl font-semibold mb-2">Ваші замовлення:</h4>
              {orders.length > 0 ? (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li key={order._id} className="border p-4 rounded bg-gray-50">
                      <p className="font-bold">Замовлення №{order._id}</p>
                      <p>Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Статус: {getStatusLabel(order.status)}</p>
                      <p>Сума: {order.totalPrice} грн</p>
                      <p>Оплата: {order.paymentMethod}</p>
                      <p className="mt-2 font-semibold">Адреса доставки:</p>
                      <p>
                        {order.address?.[0]?.area}, {order.address?.[0]?.city}, {order.address?.[0]?.warehouse}
                      </p>
                      <p className="mt-2 font-semibold">Товари:</p>
                      <ul className="list-disc list-inside">
                        {order.goods.map((good, index) => (
                          <li key={index}>
                            {good.item?.name || 'Назва відсутня'} ({good.item?.sort}) — {good.count} шт. 
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-gray-600">У вас немає замовлень</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfilePage
