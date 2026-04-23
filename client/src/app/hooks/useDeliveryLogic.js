import { useState, useEffect } from 'react'

const URL = 'https://api.novaposhta.ua/v2.0/json/'
const API_KEY = 'KEY'

const useDeliveryLogic = () => {
    const [areas, setAreas] = useState([])
    const [cities, setCities] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [selectedArea, setSelectedArea] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedWarehouse, setSelectedWarehouse] = useState('')

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await fetch(`${URL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                        apiKey: API_KEY,
                        modelName: 'Address',
                        calledMethod: 'getAreas',
                        methodProperties: {}
                    })
                })

                const data = await response.json()

                if (data.success) {
                    const filteredAreas = data.data.filter(
                        (area) => area.Description !== 'АРК'
                    )
                    setAreas(filteredAreas)
                } else {
                    console.error('Помилка отримання областей:', data.errors);
                }

            } catch (err) {
                console.error('Помилка запиту:', error)
            }
        }

        fetchAreas()
    }, [])

    const fetchCities = async (areaRef) => {
        try {
          const response = await fetch(`${URL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              apiKey: API_KEY,
              modelName: 'Address',
              calledMethod: 'getCities',
              methodProperties: {
                AreaRef: areaRef
              }
            })
          })
          const data = await response.json()
          if (data.success) {
            setCities(data.data)
          } else {
            console.error('Помилка отримання міст:', data.errors)
          }
        } catch (error) {
          console.error('Помилка запиту:', error)
        }
      }
    
    const fetchWarehouses = async (cityRef) => {
        try {
          const response = await fetch(`${URL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              apiKey: API_KEY,
              modelName: 'AddressGeneral',
              calledMethod: 'getWarehouses',
              methodProperties: {
                CityRef: cityRef
              }
            })
          })
          const data = await response.json()
          if (data.success) {
            setWarehouses(data.data)
          } else {
            console.error('Помилка отримання відділень:', data.errors)
          }
        } catch (error) {
          console.error('Помилка запиту:', error)
        }
    }

    const handleAreaChange = async (event) => {
        const areaRef = event.target.value
        const areaName = areas.find(area => area.Ref === areaRef)
        setSelectedArea(areaName.Description)
        console.log(areaName.Description)
        console.log(selectedArea)

        setCities([])
        setSelectedCity('')
        await fetchCities(areaRef)
    }

    const handleCityChange = async (event) => {
        const cityRef = event.target.value
        const cityName = cities.find(city => city.Ref === cityRef)
        setSelectedCity(cityName.Description)
        console.log(cityName.Description)
        console.log(selectedCity)

        setWarehouses([])
        setSelectedWarehouse('')
        await fetchWarehouses(cityRef)
    }

    const handleWarehouseChange = (event) => {
        const warehouseRef = event.target.value;
        const warehouseName = warehouses.find(warehouse => warehouse.Ref === warehouseRef)
        setSelectedWarehouse(warehouseName.Description)
        console.log(warehouseName.Description)
        console.log(selectedWarehouse)
    }

    useEffect(() => {
      console.log('Оновлено selectedArea:', selectedArea)
    }, [selectedArea])

    return {
      areas,
      cities,
      warehouses,
      handleAreaChange,
      handleCityChange,
      handleWarehouseChange,
      selectedArea,
      selectedCity,
      selectedWarehouse
    }
}

export default useDeliveryLogic