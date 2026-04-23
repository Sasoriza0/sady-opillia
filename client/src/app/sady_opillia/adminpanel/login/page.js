'use client'

import { useState } from 'react'
import useAdminLogic from "../../../hooks/useAdminLogic"
import Orders from '@/app/components/Orders'

const AdminLoginPage = () => {
    const { name, password, setName, setPassword, submitLogin } = useAdminLogic()
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

    return (
        <div className="bg-gray-200">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                            Вхід в акаунт
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#" onSubmit={e => e.preventDefault()}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium">Ваше ім'я</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="ім'я"
                                    required=""
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">Пароль</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        required=""
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? "Сховати" : "Показати"}
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={() => submitLogin(name, password)}
                                className="duration-200 w-full bg-green text-white hover:bg-white hover:text-black border-green border-solid border-2 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                            >
                                Вхід
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLoginPage