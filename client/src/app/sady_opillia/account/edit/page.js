'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const EditProfilePage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState({
    firstName: '',
    midleName: '',
    lastName: '',
    phone: '',
    email: ''
  })
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      setMessage('Ви не авторизовані')
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/user/info', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Не вдалося завантажити профіль')

        console.log('User data:', data)
        // Якщо користувач знайдений, оновлюємо стан
        setUserData({
          firstName: data.firstName || '',
          midleName: data.midleName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          email: data.email || ''
        })

      } catch (err) {
        setMessage(err.message)
      }
    }

    fetchUser()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setSuccess('')

    const token = localStorage.getItem('userToken')
    if (!token) return setMessage('Ви не авторизовані')

    try {
      const res = await fetch('http://localhost:4000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Помилка оновлення профілю')

      toast.success('Дані успішно оновлено!')

      setTimeout(() => {
        router.push('/sady_opillia/account') 
      },800)
      
      setSuccess('Профіль успішно оновлено')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green">Редагування профілю</h2>

        {message && <p className="text-red-600 text-center mb-4">{message}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        {/* Перевірка, чи є дані в userData */}
        {userData && (
          <>
            <label className="block mb-4">
              <span className="block mb-1">Ім’я</span>
              <input
                type="text"
                name="firstName"
                value={userData.firstName || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1">По батькові</span>
              <input
                type="text"
                name="midleName"
                value={userData.midleName || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1">Прізвище</span>
              <input
                type="text"
                name="lastName"
                value={userData.lastName || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </label>

            <label className="block mb-4">
              <span className="block mb-1">Телефон</span>
              <input
                type="tel"
                name="phone"
                value={userData.phone || ''}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-green text-white py-2 rounded hover:bg-white hover:text-green border-2 border-green transition"
            >
              Зберегти зміни
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default EditProfilePage
