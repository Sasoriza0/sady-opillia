'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [message, setMessage] = useState('')
  const [timer, setTimer] = useState(0)

  const sendCode = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/user/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Помилка надсилання коду')

      setIsCodeSent(true)
      setMessage('Код підтвердження надіслано на email')
      setTimer(30) // 30 секунд
    } catch (err) {
      setMessage(err.message)
    }
  }

  // Таймер зменшується кожну секунду
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!code) {
      setMessage('Будь ласка, введіть код підтвердження')
      return
    }
  
    try {
      const res = await fetch('http://localhost:4000/api/user/checkOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message || 'Помилка перевірки коду')
      }
  
      // Зберігаємо токен в localStorage
      localStorage.setItem('resetPasswordToken', data.token)
  
      setMessage('Код підтверджено успішно. Перейдіть до сторінки для скидання пароля.')
  
      // Напрямляємо на сторінку скидання пароля
      setTimeout(() => {
        window.location.href = '/sady_opillia/reset-password'
      }, 2000)
  
    } catch (err) {
      setMessage(err.message)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green">Відновлення пароля</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isCodeSent}
        />

        {!isCodeSent && (
          <button
            type="button"
            className="w-full bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition"
            onClick={sendCode}
          >
            Надіслати код
          </button>
        )}

        {isCodeSent && (
          <>
            <input
              type="text"
              placeholder="Код підтвердження"
              className="w-full p-2 border rounded mb-4 mt-4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green text-white p-2 rounded hover:bg-white hover:text-green border-2 border-green transition"
            >
              Підтвердити код
            </button>

            <button
              type="button"
              onClick={sendCode}
              className="w-full mt-2 text-sm text-green underline"
              disabled={timer > 0}
            >
              {timer > 0 ? `Надіслати код повторно через ${timer}с` : 'Надіслати код повторно'}
            </button>
          </>
        )}

        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}

        <p className="text-sm mt-6 text-center">
          <Link href="/sady_opillia/login" className="text-green underline no-link-style">
            Повернутися до входу
          </Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPasswordPage
