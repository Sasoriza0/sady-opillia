'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import useBasketLogic from '../../../hooks/useBasketLogic'
import useFetchGoods from '../../../hooks/useFetchGoods' 
import Loading from '../../../components/Loading' 
import Error from '../../../components/Error' 

const BASE_IMG_URL = 'http://localhost:4000'

const GoodsPage = () => {
    const { type } = useParams()
    const { goods, isLoading, error } = useFetchGoods(type)
    const { addGoodsToBasket } = useBasketLogic()

    return (
        <div>
            {isLoading && (
                <Loading/>
            )}
            {error && (
                <Error/>
            )}
            {!isLoading && !error && (
                <div className='flex gap-10 flex-wrap justify-center mb-20 mt-16'>
                    {goods.length === 0 ? (
                        <div className='text-2xl font-bold text-center'>
                        Наразі цього товару немає
                    </div>
                    ) : (goods.map((el) => {
                        return <div key={el._id} className='cursor-default goods'>
                                    <Link href={`${type}/${el._id}`} className='flex flex-col items-center no-link-style'>
                                        <div className='relative w-48 h-48 cursor-pointer'>
                                            <Image
                                            src={`${BASE_IMG_URL}/${el.image}`}
                                            layout="fill"
                                            objectFit="contain"
                                            alt={el.name}
                                            />
                                        </div>  
                                        <div className='text-lg p-2 cursor-pointer'>
                                            {el.name}
                                        </div>
                                        <div className='text-xl font-bold p-2'>
                                            {el.price}{' ₴'}
                                        </div>
                                        {el.isInStok && (
                                            <div className='p-2 text-green'>
                                                В наявності
                                            </div>
                                        )}
                                        {!el.isInStok && (
                                            <div className='p-2 text-red-600'>
                                                Немає в наявності
                                            </div>
                                        )}
                                    </Link>
                                    <div className='bg-green border-2 border-green text-white z-10 mt-3 duration-200 hover:bg-white hover:text-green'>
                                        <button onClick={() => addGoodsToBasket(el._id)} className='uppercase text-xl font-bold  py-2 px-14'>
                                            КУПИТИ
                                        </button>
                                    </div>
                                </div>
                        })
                    )}
                </div>
            )}
        </div>
    )
}
    
export default GoodsPage