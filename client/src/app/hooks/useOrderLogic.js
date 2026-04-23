import { useState } from 'react'
import { useBasketContext } from '../context/BasketContext'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { validateOrder } from '../utils/validateOrder'

const useOrderLogic = () => {
  const router = useRouter()
  const { basket, setBasket } = useBasketContext()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [midleName, setMidleName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const handleOrderSubmit = async (selectedArea, selectedCity, selectedWarehouse, totalPrice) => {
    console.log('--- Перед сабмітом ---')
  console.log('Область:', selectedArea)
  console.log('Місто:', selectedCity)
  console.log('Відділення:', selectedWarehouse)
    if (!selectedArea || !selectedCity || !selectedWarehouse) {
      toast.error('Будь ласка, виберіть область, місто та відділення для доставки.')
      return
    }

    const address = {
      area: selectedArea,
      city: selectedCity,
      warehouse: selectedWarehouse
    }

    const isValid = validateOrder({
      selectedArea,
      selectedCity,
      selectedWarehouse,
      firstName,
      lastName,
      phone,
      email,
      basket,
      paymentMethod
    })

    if (!isValid) return

    const orderData = {
      firstName,
      lastName,
      midleName,
      phone,
      email,
      address,
      paymentMethod,
      goods: basket.goods,
      totalPrice: totalPrice,
    }
    console.log('Дані замовлення:', orderData)

    const token = localStorage.getItem('token')
    

    try {

      const response = await fetch('http://localhost:4000/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Замовлення оформлено!')
        setBasket(data.basket)
        router.push('/sady_opillia')
      } else {
        const errorData = await response.json()
        console.error('Помилка при створенні замовлення:', errorData.errors || response.statusText)
        toast.error('Помилка при оформленні замовлення.')
      }
    } catch (error) {
      console.error('Помилка запиту:', error)
      toast.error('Сервер недоступний.')
    }
  }

  return {
    handleOrderSubmit,
    setFirstName,
    setLastName,
    setMidleName,
    setPhone,
    setPaymentMethod,
    setEmail,
    paymentMethod,
    lastName,
    firstName,
    midleName,
    phone,
    email
  }
}

export default useOrderLogic
