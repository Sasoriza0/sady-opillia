'use client';

import { useState } from 'react';

const images = [
  { src: '/gallery/1.jpg', },
  { src: '/gallery/2.jpg', },
  { src: '/gallery/3.jpg', },
  { src: '/gallery/4.jpg', },
  { src: '/gallery/5.jpg', },
  { src: '/gallery/6.jpg', },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Галерея</h1>
      <p className="text-gray-600 mb-10">
        Перегляньте фотографії наших саджанців.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img, index) => (
          <div key={index} className="cursor-pointer group" onClick={() => setSelectedImage(img)}>
            <img
              src={img.src}
              alt={img.alt}
              className="rounded-xl shadow-md w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm mt-2 text-center text-gray-700">{img.alt}</p>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full p-4">
            <img src={selectedImage.src} alt={selectedImage.alt} className="w-full rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
