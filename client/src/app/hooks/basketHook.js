import { useState } from "react"

const useBasket = () => {
    const [isBasketOpen, setIsBasketOpen] = useState()

    const openBasket = () => setIsBasketOpen(true)
    const closeBasket = () => setIsBasketOpen(false)

    return {isBasketOpen, openBasket, closeBasket}
}

export default useBasket