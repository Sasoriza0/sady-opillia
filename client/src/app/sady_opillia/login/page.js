'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Помилка входу')
        
      }

      localStorage.setItem('userToken', data.token)
      window.location.href = '/sady_opillia' 
      toast.success('Вхід успішний')
    } catch (err) {
      toast.error('Невірний email чи пароль' )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green">Вхід</h2>

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
        
        <div className="mb-4 text-right">
          <Link href="/sady_opillia/forgot-password" className="text-sm text-green underline no-link-style">
           Забули пароль?
          </Link>
        </div>

        <button type="submit" className="w-full bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition">
          Увійти
        </button>

        <p className="text-sm mt-4 text-center">
          Ще немає акаунта?{' '}
          <Link href="/sady_opillia/register" className="text-green underline no-link-style">
            Зареєструватися
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
