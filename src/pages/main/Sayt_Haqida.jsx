import React, { useState } from 'react'
import guruhlar from '../main/guruhlar.png'
import teacherModal from '../main/teacherModal.png'
import ustozlar from '../main/ustozlar.png'
import tolovlar from '../main/tolov.png'
import tolovlar2 from '../main/tolov2.png'

const Sayt_Haqida = () => {
  const [activeImage, setActiveImage] = useState(null);

  const sections = [
    {
      title: "Guruhlar bo'limi",
      images: [guruhlar],
      description: "Bu bo'limda guruhlar boshqariladi, yangi guruhlar yaratish va har bir guruhni joriy holati haqida ma'lumot olish mumkin. Undan tashqari guruhlarni o'zgartirish yopilgan guruhlarni o'chirish mumkin"
    },
    {
      title: "Ustozlar bo'limi",
      images: [ustozlar, teacherModal],
      description: "Bu bo'limda ustozlarni kuzatish tahrirlash  va o'chirish mumkin"
    },
    {
      title: "To'lovlar bo'limi",
      images: [tolovlar, tolovlar2],
      description: "Bu bo'limda markazning to'lovlari bilan bog'liq bo'lgan barcha operatsiyalar amalga oshiriladi. O'quvchilardan oyliq to'lovni qabul qilish, O'qituvchilarga oylik to'lash, Markazda bo'ladigan boshqa qo'shimcha to'lovlarni amalga oshirish"
    }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8 md:mb-12 animate-fade-in">
          Sayt Haqida
        </h1>

        <div className="space-y-8 md:space-y-16">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-4 md:p-8 transform hover:scale-[1.02] transition-all duration-300"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6 border-b border-gray-700 pb-2">
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {section.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="relative group">
                    <img
                      src={image}
                      alt={`${section.title} ${imgIndex + 1}`}
                      className="w-full  rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveImage(image)}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center cursor-pointer ">
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 md:mt-6 text-lg md:text-2xl text-gray-300 leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for enlarged image */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img 
              src={activeImage} 
              alt="Enlarged view" 
              className="w-full h-auto rounded-lg"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
              onClick={() => setActiveImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sayt_Haqida
