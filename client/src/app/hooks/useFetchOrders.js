import { useEffect, useState } from 'react'
import useAbortController from './useAbortController'

const BASE_URL = 'http://localhost:4000/api'

const useFetchOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { createAbortController, abort, signal } = useAbortController()

  useEffect(() => {
    const fetchOrders = async () => {
      createAbortController()
      setIsLoading(true)

      const adminToken = localStorage.getItem('adminToken')

      try {
        const res = await fetch(`${BASE_URL}/order/view/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          signal
        })

        if (!res.ok) {
          throw new Error('Помилка отримання замовлень')
        }

        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()

    return () => abort()
  }, [])

  return { orders, isLoading, error, setOrders }
}

export default useFetchOrders
