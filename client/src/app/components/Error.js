import React from 'react'
import Link from 'next/link'

const Error = () => {
    return (
        <div className="m-52 mx-auto grid place-items-center text-center px-8">
                <div>
                <div
                    variant="h1"
                    color="blue-gray"
                    className="m-8 !text-3xl !leading-snug md:!text-4xl"
                >
                    Помилка 404 <br /> Щось пішло не так {':('}
                </div>
                <Link href={'/'} className="no-link-style text-white  bg-green p-4 rounded-md w-full px-4 md:w-[8rem] hover:text-yellow-300">
                    Повернутись на головну
                </Link>
            </div>
        </div>
    )
}

export default Error