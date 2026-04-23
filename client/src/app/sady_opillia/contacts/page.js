// /sady_opillia/contacts/page.js
'use client'
import { useState } from 'react'

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Надіслати через fetch або інший спосіб
    alert('Повідомлення надіслано!');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Звʼяжіться з нами</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Ваше ім’я"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <textarea
          placeholder="Повідомлення"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="p-2 border rounded"
          rows={5}
          required
        />
        <button type="submit" className="bg-green-700 text-white py-2 rounded">
          Надіслати
        </button>
      </form>
    </div>
  );
}
