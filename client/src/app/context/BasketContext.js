'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'

const BasketContext = createContext()

export const useBasketContext = () => useContext(BasketContext)

const BASE_URL = 'http://localhost:4000/api'

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBasket = async () => {
      try {
        let localToken = localStorage.getItem('token')
        if (!localToken) {
          const response = await fetch(`${BASE_URL}/basket/create`, {
            method: 'POST',
          })
          const data = await response.json()
          localToken = data.token
          localStorage.setItem('token', localToken)
        }

        setToken(localToken)

        const basketResponse = await fetch(`${BASE_URL}/basket/view`, {
          headers: {
            Authorization: `Bearer ${localToken}`,
          },
        })
        if (basketResponse.ok) {
          const basketData = await basketResponse.json()
          setBasket(basketData.basket)
        } else {
          const newBasketResponse = await fetch(`${BASE_URL}/basket/create`, {
            method: 'POST',
          })
          const newBasketData = await newBasketResponse.json()
          setBasket(newBasketData.basket)
          localStorage.setItem('token', newBasketData.token)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    };

    loadBasket()
  }, [])  

  return (
    <BasketContext.Provider
      value={{
        basket,
        setBasket,
        token,
        setToken,
        isLoading,
        error
      }}
    >
      {children}
    </BasketContext.Provider>
  )
}