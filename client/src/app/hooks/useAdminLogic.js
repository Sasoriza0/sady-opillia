import { useState } from "react" 
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const URL = 'http://localhost:4000/api/admin/login'

const useAdminLogic = () => {
    const router = useRouter()

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const submitLogin = async (name, password) => {
        try {
            console.log(name, password)
            const response = await fetch(`${URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, password})
            })

            if (!response.ok) {
                toast.error('Неправильний логін або пароль')
                console.error(`Помилка оновлення товару: ${response.status}`)
            } else {
                const data = await response.json()
                const adminToken = data.adminToken
                localStorage.setItem('adminToken', adminToken)
                toast.success('Вхід успішний!')
                setTimeout(() => {
                    router.push('/sady_opillia/adminpanel')    
                }, 500)
            }
                
        } catch (err) {
            console.error('Помилка з\'єднання: ')
        }
    }

    return {
        name,
        password,
        setName,
        setPassword,
        submitLogin
    }
}

export default useAdminLogic