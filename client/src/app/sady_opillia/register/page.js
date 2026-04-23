'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const RegisterPage = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirm) {
      toast.error('Паролі не співпадають!')
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/user/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Помилка реєстрації')
      }

      localStorage.setItem('userToken', data.token)
      window.location.href = '/sady_opillia' 
      toast.success('Реєстрація успішна')
    } catch (err) {
      toast.error('Пошта вже використовується')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green">Реєстрація</h2>

        <input
          type="text"
          placeholder="Ім’я"
          className="w-full p-2 border rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-green"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Сховати' : 'Показати'}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Підтвердити пароль"
            className="w-full p-2 border rounded pr-10"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-green"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? 'Сховати' : 'Показати'}
          </button>
        </div>

        <button type="submit" className="w-full bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition">
          Зареєструватися
        </button>

        <p className="text-sm mt-4 text-center">
          Вже маєш акаунт?{' '}
          <Link href="/sady_opillia/login" className="text-green underline no-link-style">
            Увійти
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
