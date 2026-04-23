import { useEffect, useState } from "react" 
import { useRouter } from "next/navigation" 

const BASE_URL = 'http://localhost:4000/api/admin'

const useAdminAuth = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAdminAuth = async () => {
            const adminToken = localStorage.getItem('adminToken')

            if (!adminToken) {
                router.replace('/sady_opillia/adminpanel/login')
                return
            }

            try {
                const response = await fetch(`${BASE_URL}/auth`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                })

                if (!response.ok) {
                    localStorage.removeItem('adminToken')
                    router.replace('/sady_opillia/adminpanel/login')
                } else {
                    setIsLoading(false)
                }
            } catch (err) {
                console.error("Помилка перевірки авторизації:", err)
                router.replace('/sady_opillia/adminpanel/login')
            }
        } 

        checkAdminAuth()
    }, [router])

    return isLoading
}

export default useAdminAuth