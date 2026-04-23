import { useEffect, useState } from 'react'
import useAbortController from './useAbortController'

const BASE_URL = 'http://localhost:4000/api'

const useFetchGoods = (type) => {
    const [goods, setGoods] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const { createAbortController, abort, signal } = useAbortController()

    useEffect(() => {
        const fetchGoods = async () => {
            createAbortController()
            setIsLoading(true)

            try {
                const response = await fetch(`${BASE_URL}/goods/fruit/${type}`, {
                    signal
                })

                if (response.status === 204) {
                    setGoods([])
                    return
                }

                const goodsData = await response.json()
                setGoods(goodsData.goods)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err)
                }
            } finally {
                setIsLoading(false)
            }
        }

        fetchGoods()

        return () => abort()
    }, [type])

    return { 
        goods, 
        isLoading, 
        error 
    }
}

export default useFetchGoods