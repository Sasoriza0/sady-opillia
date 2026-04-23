import { toast } from 'react-toastify'

export const validateOrder = ({ 
  selectedArea, 
  selectedCity, 
  selectedWarehouse, 
  firstName, 
  lastName, 
  phone, 
  email,
  basket, 
  paymentMethod 
}) => {
  if (!selectedArea || !selectedCity || !selectedWarehouse) {
    toast.error('Будь ласка, виберіть область, місто та відділення для доставки.')
    return false
  }

  if (!paymentMethod) {
    toast.error('Будь ласка, виберіть спосіб оплати.')
    return false
  }

  if (!firstName || !lastName || !phone) {
    toast.error("Будь ласка, заповніть всі обов'язкові поля отримувача.")
    return false
  }

  if (!basket?.goods || basket.goods.length === 0) {
    toast.error('Ваш кошик порожній.')
    return false
  }

  if (!email) {
    toast.error("Будь ласка, введіть електронну адресу.")
    return
  }

  return true
}