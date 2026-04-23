import { useEffect, useState } from 'react'
import useAbortController from './useAbortController'

const BASE_URL = 'http://localhost:4000/api'

const useFetchProduct = (id) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [product, setProduct] = useState({})
    const { createAbortController, abort, signal } = useAbortController()

    useEffect(() => {
        const fetchProduct = async () => {
            createAbortController()
            setIsLoading(true)

            try {
                const response = await fetch(`${BASE_URL}/goods/view/${id}`, {
                    signal
                })
                const productData = await response.json()
                setProduct(productData.goods)
            } catch (err) {
                if (err.name === 'AbortError') {
                    return
                }

                setError(err)
            } finally {
                setIsLoading(false)
            }  
        }

        fetchProduct()

        return () => abort()
    }, [id])

    return {
        product,
        error,
        isLoading
    }
}

export default useFetchProduct