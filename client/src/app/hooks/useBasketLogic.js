import { useBasketContext } from "../context/BasketContext" 
import { toast } from 'react-toastify'

const BASE_URL = 'http://localhost:4000/api'

export default function useBasketLogic() {
    const {basket, setBasket, token} = useBasketContext()

    const updateQuantitiy = async (productId, newQuantity) => {
        const itemInBasket = basket.goods.find(item => item.item._id === productId)

        const maxStock = itemInBasket.item.count
        if (newQuantity > maxStock) {
        toast.warning(`Доступно лише ${maxStock} шт.`)
        return
        }

        try {
            const response = await fetch(`${BASE_URL}/basket/update/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({newCount: newQuantity})
            })

            if (response.ok) {
                const data = await response.json()
                setBasket(data.updatedBasket)
                setQuantities((prev) => ({...prev, [productId]: newQuantity}))
            } else {
                console.error(`Помилка оновлення товару: ${response.status}`)
            }
        } catch (err) {
            console.error('Помилка з\'єднання: ')
        }
    }

    const handleInputChange = (e, productId) => {
        const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1)
        updateQuantitiy(productId, newQuantity)
    }

    const removeGoods = async (productId) => {
        try {
            const response = await fetch(`${BASE_URL}/basket/removeGoods/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'aplication/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setBasket(data.updatedBasket)
                toast.success('Товар видалено з корзини!')
            } else {
                console.error('Помилка видалення товару!')
            }
        } catch (err) {
            console.error('Помилка з\'єднання: ')
        }
    }

    const addGoodsToBasket = async (productId) => {
        try {
            const response = await fetch(`${BASE_URL}/basket/add/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                toast.success('Товар додано до корзини!')
                setBasket(data.updatedBasket)
            } else {
                toast.error('Товар вже є в корзині!')
                console.error('Помилка додавання товару!')
            }
        } catch (err) {
            console.error('Помилка з\'єднання: ')
        }
    }

    return {
        basket,
        handleInputChange,
        updateQuantitiy,
        removeGoods,
        addGoodsToBasket
    }
}