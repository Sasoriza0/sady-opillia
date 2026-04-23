'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ResetPasswordPage = () => {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('resetPasswordToken')
    if (!newPassword) {
      setMessage('Пароль не може бути порожнім')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('http://localhost:4000/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, token }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Помилка при скиданні пароля')

      setMessage('Пароль успішно оновлено')
      setIsSubmitting(false)

      localStorage.removeItem('resetPasswordToken')
      
      router.push('/sady_opillia/login') /
    } catch (err) {
      setMessage(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green">Встановлення нового пароля</h2>

        <input
          type="password"
          placeholder="Новий пароль"
          className="w-full p-2 border rounded mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оновлення...' : 'Оновити пароль'}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}
      </form>
    </div>
  )
}

export default ResetPasswordPage
