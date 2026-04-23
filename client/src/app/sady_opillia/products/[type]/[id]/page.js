'use client'

export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Loading from '../../../../components/Loading' 
import Error from '../../../../components/Error' 
import useBasketLogic from '../../../../hooks/useBasketLogic'
import useFetchProduct from '../../../../hooks/useFetchProduct'

const BASE_IMG_URL = 'http://localhost:4000'

const ProductPage = () => {
    const {id} = useParams()
    const { product, error, isLoading } = useFetchProduct(id)
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
            <div key={product._id} className='w-200 gap-24 px-32 py-16 product-box mx-auto'>
                <div className='flex gap-16'>
                    <div className='relative w-128 max-h-72 overflow-hidden group'>
                        <Image className="transform transition-transform duration-300 ease-custom group-hover:scale-150 cursor-zoom-in"
                        src={`${BASE_IMG_URL}/${product.image}`}
                        layout="responsive" 
                        width={1000} 
                        height={1000} 
                        objectFit="contain"
                        quality={90} 
                        alt={product.name}
                        priority={true}
                        />
                    </div>
                    <div className='w-full flex flex-col'>
                        <div className='text-xl font-bold'>
                            Саджанці яблунь "{product.name}"
                        </div>
                        {product.isInStok && (
                            <div className='text-green mt-5'>
                                В наявності
                            </div>
                        )}
                        {!product.isInStok && (
                            <div className='text-red-600 mt-5'>
                                Немає в наявності
                            </div>
                        )}
                        <div className='text-xl font-bold mt-5 bg-yellow-300 p-2 rounded-md w-20 flex justify-center'>
                            {product.price}{' ₴'}
                        </div>
                        <div className='mt-8 flex justify-center w-52 bg-green border-2 border-green text-white z-10 duration-200 hover:bg-white hover:text-green'>
                            <button className='uppercase text-xl font-bold py-2 px-14'
                                onClick={() => addGoodsToBasket(product._id)}
                            >
                                КУПИТИ
                            </button>
                        </div>
                    </div>
                </div>
                <div className='border-t-2 pt-4'>
                    <span className='text-lg'>
                        Опис:
                    </span>
                    <div className='text-lg mt-1 mb-5'>
                        {product.description}
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default ProductPage