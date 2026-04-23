'use client'

import Loading from '../../components/Loading' 
import Error from '../../components/Error' 
import useDeliveryLogic from '../../hooks/useDeliveryLogic'
import { useBasketContext } from '../../context/BasketContext'
import useOrderLogic from '../../hooks/useOrderLogic'
import { useEffect, useState } from 'react'

const OrderPage = () => {
  const { basket, isLoading, error } = useBasketContext()
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    midleName: '',
    phone: '',
    email: ''
  })

  const totalPrice = basket?.goods?.reduce(
  (sum, good) => sum + (good.item?.price ?? 0) * (good.count ?? 0), 
  0
 ) 

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      const fetchUserData = async () => {
        try {
          const res = await fetch('http://localhost:4000/api/user/info', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const data = await res.json()
          if (res.ok) {
            setUserData({
              firstName: data.firstName,
              lastName: data.lastName,
              midleName: data.midleName,
              phone: data.phone,
              email: data.email
            })
          } else {
            console.error('Failed to fetch user data')
          }
        } catch (err) {
          console.error('Error fetching user data:', err)
        }
      }

      fetchUserData()
    }
  }, [])

  const {
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
    email,
    handleOrderSubmit
  } = useOrderLogic()

  const {
    areas,
    cities,
    warehouses,
    handleAreaChange, 
    handleCityChange,
    handleWarehouseChange,
    selectedArea,
    selectedCity,
    selectedWarehouse
  } = useDeliveryLogic()

  useEffect(() => {
    setFirstName(userData.firstName)
    setLastName(userData.lastName)
    setMidleName(userData.midleName)
    setPhone(userData.phone)
    setEmail(userData.email)
  }, [userData, setFirstName, setLastName, setMidleName, setPhone, setEmail])

  return (
    <div>
      {isLoading && <Loading />}
      {error && <Error />}
      {!isLoading && !error && (
        <div className='min-h-screen p-8'>
          <div className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-4'>Замовлення</h2>

            {/* --- Доставка --- */}
            <h3 className='text-lg font-bold mb-2'>Доставка</h3>
            <div>
              <label className='border rounded-lg p-4 flex items-start gap-4 cursor-pointer'>
                <input type='radio' name='delivery' className='form-radio mt-1' defaultChecked />
                <div className='w-full'>
                  <p className='font-semibold'>Самовивіз з Нової Пошти</p>

                  <select className='mt-2 border rounded p-2 w-full' onChange={handleAreaChange}>
                    <option value=''>Виберіть область</option>
                    {areas.map((area) => (
                      <option key={area.Ref} value={area.Ref}>
                        {area.Description}
                      </option>
                    ))}
                  </select>

                  {selectedArea && (
                    <select className='mt-2 border rounded p-2 w-full' onChange={handleCityChange}>
                      <option value=''>Виберіть місто</option>
                      {cities.map((city) => (
                        <option key={city.Ref} value={city.Ref}>
                          {city.Description}
                        </option>
                      ))}
                    </select>
                  )}

                  {selectedCity && (
                    <select className='mt-2 border rounded p-2 w-full' onChange={handleWarehouseChange}>
                      <option value=''>Виберіть відділення</option>
                      {warehouses.map((wh) => (
                        <option key={wh.Ref} value={wh.Ref}>
                          {wh.Description}
                        </option>
                      ))}
                    </select>
                  )}

                  <button className='mt-2 p-2 bg-blue-500 text-white rounded'>
                    Обрати на мапі
                  </button>
                </div>
              </label>
            </div>

            {/* --- Оплата --- */}
            <h3 className='text-lg font-bold mt-6 mb-2'>Оплата</h3>
            <div className='space-y-4 mb-6'>
              <label className='border rounded-lg p-4 flex items-center cursor-pointer'>
                <input
                  type="radio"
                  name="payment"
                  value="Оплата під час отримання товару"
                  checked={paymentMethod === 'Оплата під час отримання товару'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='form-radio mr-4' />
                <p>Оплата під час отримання товару</p>
              </label>

            </div>

            {/* --- Отримувач --- */}
            <h3 className='text-lg font-bold mb-2'>Отримувач</h3>
            <div className='space-y-4 mb-6'>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='Прізвище'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='border rounded p-2 w-full'
                />
                <input
                  type='text'
                  placeholder="Ім'я"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='border rounded p-2 w-full'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='По батькові'
                  value={midleName}
                  onChange={(e) => setMidleName(e.target.value)}
                  className='border rounded p-2 w-full'
                />
                <input
                  type='tel'
                  placeholder='Мобільний телефон'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='border rounded p-2 w-full'
                />
              </div>
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='border rounded p-2 w-full'
              />
            </div>

            {/* --- Товари --- */}
            <div className='mb-6'>
              <h3 className='text-lg font-bold mb-4'>Список товарів у кошику</h3>
              {basket?.goods?.length > 0 ? (
                <ul className='space-y-4'>
                  {basket.goods.map((item) => (
                    <li
                      key={item.item._id}
                      className='border p-4 rounded-lg flex justify-between'>
                      <div>
                        <p className='font-semibold'>{item.item.name}</p>
                        <p className='text-sm text-gray-500'>Кількість: {item.count}</p>
                      </div>
                      <p>{item.item.price * item.count} ₴</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Кошик порожній.</p>
              )}
            </div>

            {/* --- Підсумок --- */}
            <div className='bg-gray-50 p-4 rounded-lg mt-6 shadow-md'>
              <div className='flex justify-between mb-2'>
                <p>Товарів на суму</p>
                <p>{totalPrice ?? 0} ₴</p>
              </div>
              <div className='flex justify-between mb-2'>
                <p>Вартість доставки</p>
                <p>за тарифами перевізника</p>
              </div>
              <div className='flex justify-between font-bold text-lg'>
                <p>До сплати</p>
                <p>{totalPrice} ₴</p>
              </div>
              <button
                onClick={() => handleOrderSubmit(selectedArea, selectedCity, selectedWarehouse, totalPrice)}
                className='w-full mt-4 py-2 bg-green border-2 border-green duration-200 hover:bg-white hover:text-green text-white font-bold rounded'>
                Замовити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderPage
