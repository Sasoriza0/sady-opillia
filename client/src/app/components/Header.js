'use client'

import React, { useEffect, useState } from 'react'
import Link from "next/link"
import Image from 'next/image'
import useDropdown from '../hooks/dropDownMenuHook' 
import useBasket from '../hooks/basketHook'
import useBasketLogic from '../hooks/useBasketLogic'
import { isLoading } from '../context/BasketContext' 

const BASE_IMG_URL = 'http://localhost:4000'

const Header = () => {
  const { isDropdownOpen, openDropdown, closeDropdown } = useDropdown()
  const { isBasketOpen, openBasket, closeBasket } = useBasket()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  const {
    basket,
    updateQuantitiy,
    handleInputChange,
    removeGoods,
  } = useBasketLogic()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      setIsAuth(true)
    }
  }, [])

  const handleCloseElement = () => {
    setIsAnimating(true)
    setTimeout(() => {
      if (isDropdownOpen) {
        closeDropdown()
      } else {
        closeBasket()
      }
      setIsAnimating(false)
    }, 200)
  }

  return (
    <header className="bg-green p-3 z-40">
      <div className="container text-white flex justify-between items-center">
        <Link href="/sady_opillia" className="no-link-style">
          <Image src="/img/logo.png" height={120} width={120} alt="logo" />
        </Link>

        <nav className="flex gap-5">
          <Link href="/sady_opillia">Головна</Link>

          <div onMouseEnter={openDropdown} onMouseLeave={handleCloseElement}>
            <Link className="flex gap-1" href="/sady_opillia">
              Товари
              <Image
                className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                src="/img/dropDownArrow.png"
                height={15}
                width={15}
                alt="dropdown"
              />
            </Link>

            {isDropdownOpen && (
              <div className={`flex flex-col absolute bg-green p-5 gap-4 rounded-md ${isAnimating ? 'animate-slide-out' : 'animate-slide-in'}`}>
                <Link href="/sady_opillia/products/apple">Яблуня</Link>
                <Link href="/sady_opillia/products/pear">Груша</Link>
                <Link href="/sady_opillia/products/cherry">Черешня</Link>
                <Link href="/sady_opillia/products/peach">Персик</Link>
                <Link href="/sady_opillia/products/apricote">Абрикоса</Link>
                <Link href="/sady_opillia/products/nectarine">Нектарина</Link>
              </div>
            )}
          </div>

          <Link target="_blank" href="https://www.youtube.com/@СадиОпілля">Відео</Link>
          <Link href="/sady_opillia/gallery">Галерея</Link>
          <a href="mailto:sadyopillia@gmail.com">Контакти</a>
          <Link href="/sady_opillia/about">Про нас</Link>
        </nav>

        {isAuth ? (
          <Link
            href="/sady_opillia/account"
            className="no-link-style ml-4 px-4 py-2  text-white  hover:text-yellow-400 transition"
          >
            <Image
  src="/img/account-white-icon.png"
  alt="Акаунт"
  width={30}
  height={30}
/>

          </Link>
        ) : (
          <Link
            href="/sady_opillia/login"
            className="no-link-style ml-4 px-4 py-2 border-2 border-white text-white rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Увійти / Зареєструватися
          </Link>
        )}

        <button onClick={openBasket} className="relative ml-4">
          <Image src="/img/basket.png" height={30} width={30} alt="кошик" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-xs text-white flex items-center justify-center">
            {basket?.goods?.length || 0}
          </span>
        </button>

        {isBasketOpen && (
          <div className={`bg-white top-0 right-0 h-screen fixed w-100 overflow-y-auto p-5 rounded-l-3xl ${isAnimating ? 'animate-side-slide-in' : 'animate-side-slide-out'}`}>
            <div className="flex justify-center items-center sticky -top-5 z-10 bg-white p-2 pt-5">
              <button onClick={handleCloseElement} className="absolute left-4 top-4">
                <Image src="/img/dagger.svg" height={30} width={30} alt="закрити" />
              </button>
              <h1 className="text-black uppercase font-bold">КОШИК</h1>
            </div>

            <div className="p-2 text-black flex flex-col justify-center items-center">
              {!isLoading && basket?.goods?.length > 0 ? (
                basket.goods.map((product, index) => (
                  <div key={index} className="flex items-center p-2 border-b relative w-full">
                    <button className="absolute top-4 right-3" onClick={() => removeGoods(product.item._id)}>
                      <Image src="/img/dagger.svg" height={30} width={30} alt="видалити" />
                    </button>

                    <div>
                      <Image src={`${BASE_IMG_URL}/${product.item.image}`} height={120} width={120} alt={product.item.name} />
                    </div>

                    <div className="flex flex-col m-10 items-center">
                      <h2 className="font-bold">{product.item.name}</h2>
                      <p>Ціна: {product.item.price} грн</p>
                      <div className="flex gap-4">
                        <button onClick={() => updateQuantitiy(product.item._id, product.count + 1)} className="p-3 bg-green rounded-md text-white">+</button>
                        <input
                          value={product.count}
                          className="w-16 p-1 border border-gray-300 rounded-md text-center"
                          onChange={(e) => handleInputChange(e, product.item._id)}
                        />
                        <button onClick={() => updateQuantitiy(product.item._id, product.count - 1)} className="p-3 bg-green rounded-md text-white">-</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Кошик порожній</p>
              )}
            </div>

            {basket?.goods?.length > 0 && (
              <div className="sticky -bottom-5 left-0 right-0 p-2 pb-8 bg-white flex flex-col justify-center items-center gap-2">
                <div className="text-black text-lg font-bold">
                  {`Сума: ${basket.totalPrice}₴`}
                </div>
                <a href="/sady_opillia/order" className="no-link-style bg-green text-lg font-bold px-12 py-4 rounded-lg border-2 border-green duration-200 hover:bg-white hover:text-green">
                  Оформити замовлення
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
