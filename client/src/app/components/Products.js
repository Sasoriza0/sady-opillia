'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const BASE_URL = 'http://localhost:4000/api'
const BASE_IMG_URL = 'http://localhost:4000'

const fruitTypeMap = {
  яблуко: 'apple',
  груша: 'pear',
  персик: 'peach',
  черешня: 'cherry',
  нектарин: 'nectarine',
  абрикос: 'apricot'
}

const reverseFruitTypeMap = {
  apple: 'яблуко',
  pear: 'груша',
  peach: 'персик',
  cherry: 'черешня',
  nectarine: 'нектарин',
  apricot: 'абрикос'
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', fruitType: 'яблуко' })
  const [editingProduct, setEditingProduct] = useState(null)
  const [isCreateFormVisible, setCreateFormVisible] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    // Завантажуємо всі товари при першому рендерингу
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/goods/view`)
        const data = await res.json()
        setProducts(data.goods) 
      } catch (err) {
        alert('Помилка при завантаженні товарів')
      }
    }

    fetchProducts()
  }, [])

  // Додавання нового товару
  const handleAddProduct = async () => {
     const { name, price, description, fruitType, imageFile, sort, count } = newProduct;

    if (!name || !price || !description || !fruitType || !imageFile || !sort || !count) {
      toast.error('Будь ласка, заповніть всі поля!');
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      toast.error('Ціна має бути додатнім числом!');
      return;
    }

    if (isNaN(count) || Number(count) < 0) {
      toast.error('Кількість має бути 0 або більше!');
      return;
    }



    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('fruitType', fruitTypeMap[fruitType] || fruitType);
    formData.append('image', newProduct.imageFile);
    formData.append('sort', newProduct.sort);  
    formData.append('count', newProduct.count);

    const adminToken = localStorage.getItem('adminToken')
    const response = await fetch(`${BASE_URL}/goods/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: formData,
    })
    if (response.ok) {
      const data = await response.json()
      setProducts((prev) => [...prev, data])
      setNewProduct({
      name: '',
      price: '',
      description: '',
      fruitType: 'яблуко',
      imageFile: null,
      sort: '',
      count: '',
    });

    // Закрити форму
    setCreateFormVisible(false);

    toast.success('Товар успішно додано!');
    }
  }
  

  // Оновлення товару
const handleEditProduct = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
  
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('sort', editingProduct.sort);
      formData.append('price', editingProduct.price);
      formData.append('description', editingProduct.description);
      formData.append('fruitType', fruitTypeMap[editingProduct.fruitType] || editingProduct.fruitType);
      formData.append('season', editingProduct.season);
      formData.append('count', editingProduct.count);
  
      if (editingProduct.imageFile) {
        formData.append('image', editingProduct.imageFile); // передаємо File
      }
  
      const res = await fetch(`${BASE_URL}/goods/update/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Помилка при оновленні');
  
      setProducts((prev) =>
        prev.map((product) =>
          product._id === data.updatedGoods._id ? data.updatedGoods : product
        )
      );
      setEditingProduct(null);
      toast.success('Товар успішно оновлено!');
    } catch (err) {
      toast.error('Не вдалося оновити!');
      console.error(err);
    }
  };
  
  

  // Видалення товару
  const handleDeleteProduct = async (productId) => {
    try {
      const adminToken = localStorage.getItem('adminToken')
      const res = await fetch(`${BASE_URL}/goods/remove/${productId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${adminToken}`,
          },
      })
      if (!res.ok) throw new Error('Не вдалося видалити товар')

      setProducts((prev) => prev.filter((product) => product._id !== productId))
      toast.success('Товар успішно видалено!');
    } catch (err) {
      toast.error('Не вдалося видалити товар!');
    }
  }

  // Обробка зміни зображення
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditingProduct({ ...editingProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Будь ласка, виберіть зображення!');
    }
  };

  // Фільтрація товарів за назвою
  const filteredProducts = Array.isArray(products)
  ? products.filter(
      (product) =>
        typeof product.name === 'string' &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Список товарів</h2>

      {/* Пошук */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Пошук за назвою..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Кнопка для додавання нового товару */}
      <div className="mb-6 text-center">
        <button
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setCreateFormVisible(!isCreateFormVisible)}
        >
          {isCreateFormVisible ? 'Скасувати створення товару' : 'Додати новий товар'}
        </button>
      </div>

      {/* Форма для додавання нового товару */}
{isCreateFormVisible && (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-4">Додати новий товар</h3>
    
    {/* Назва товару */}
    <input
      type="text"
      placeholder="Назва"
      value={newProduct.name}
      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
    
    {/* Ціна товару */}
    <input
      type="number"
      placeholder="Ціна"
      value={newProduct.price}
      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
      className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
    
    {/* Опис товару */}
    <textarea
      placeholder="Опис"
      value={newProduct.description}
      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
      className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
    
    {/* Селектор для вибору виду фрукту */}
    <select
      value={newProduct.fruitType}
      onChange={(e) => setNewProduct({ ...newProduct, fruitType: e.target.value })}
      className="block mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
    >
      <option value="яблуко">Яблуко</option>
      <option value="груша">Груша</option>
      <option value="персик">Персик</option>
      <option value="черешня">Черешня</option>
      <option value="абрикос">Абрикос</option>
      <option value="нектарин">Нектарин</option>
      {/* Додайте інші фрукти за потребою */}
    </select>
    
    {/* Вибір зображення */}
    <input
      type="file"
      onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
      className="block mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
    
    {/* Сорт товару */}
    <input
      type="text"
      placeholder="Сорт"
      value={newProduct.sort}
      onChange={(e) => setNewProduct({ ...newProduct, sort: e.target.value })}
      className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
    
    {/* Кількість товару */}
    <input
      type="number"
      placeholder="Кількість"
      value={newProduct.count}
      onChange={(e) => setNewProduct({ ...newProduct, count: e.target.value })}
      className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
    />

          <button
            className="px-6 py-2 bg-emerald-600 text-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleAddProduct}
          >
            Додати товар
          </button>
        </div>
      )}

      {/* Список товарів */}
      <ul className="space-y-6">
        {filteredProducts.map((product) => (
          <li key={product._id} className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
            <p className="text-lg font-semibold mb-1">{product.name}</p>
            <p className="mb-1">💰 Ціна: {product.price} грн</p>
            <p className="mb-4">📝 Опис: {product.description}</p>
            <p className="mb-4">🍏 Тип: {reverseFruitTypeMap[product.fruitType] || product.fruitType}</p>
            <p className="mb-4">📦 Кількість в наявності: {product.count}</p>
            {/* Попередній перегляд зображення */}
            {product.image && (
              <img
                src={`${BASE_IMG_URL}/${product.image}`}
                alt={product.name}
                className="mb-4 w-32 h-32 object-cover rounded-lg"
              />
            )}

            {/* Кнопки редагування та видалення */}
            <div className="flex space-x-4">
              <button
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => setEditingProduct(product)} // Відкриваємо форму редагування
              >
                Редагувати
              </button>
              <button
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleDeleteProduct(product._id)}
              >
                Видалити
              </button>
            </div>

            {/* Форма редагування товару */}
            {editingProduct && editingProduct._id === product._id && (
              <div className="mt-4">
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="block mb-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="block mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {/* Селектор для вибору виду фрукту */}
                <select
                  value={editingProduct.fruitType}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fruitType: e.target.value })}
                  className="block mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="яблуко">Яблуко</option>
                  <option value="груша">Груша</option>
                  <option value="персик">Персик</option>
                  <option value="черешня">Черешня</option>
                  <option value="нектарин">Нектарин</option>
                  <option value="абрикос">Абрикос</option>
                </select>

                {/* Вибір нового зображення */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setEditingProduct((prev) => ({
                                ...prev,
                            imageFile: e.target.files[0],
      }));
    }
  }}
  className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
/>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mb-4 w-32 h-32 object-cover rounded-lg"
                  />
                )}

                <button
                  className="px-6 py-2 bg-emerald-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleEditProduct}
                >
                  Оновити товар
                </button>
                <button
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ml-2"
                  onClick={() => setEditingProduct(null)} // Скасувати редагування
                >
                  Скасувати
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Products
