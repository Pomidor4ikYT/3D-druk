'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';

export default function PrinterPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Дані про принтери з локальними зображеннями
  const printers = [
    {
      name: 'Bambu Lab X1 Carbon',
      tag: 'Флагманська модель',
      img: '/images/printer/Bambu Lab X1 Carbon1.jpg',
      specs: [
        { label: 'Технологія', value: 'FDM (FFF)' },
        { label: 'Робоча область', value: '256×256×256 мм' },
        { label: 'Точність', value: '±0.1 мм' },
        { label: 'Швидкість', value: 'до 500 мм/с' },
        { label: 'Кольоровий друк', value: 'AMS (до 16 кольорів)' },
        { label: 'Екран', value: '5" сенсорний' },
      ],
      description: 'Потужний принтер з повнокольоровим друком, автоматичним калібруванням та вбудованою камерою. Ідеальний для професійних завдань.',
      color: '#c9a84c',
      featured: true,
    },
    {
      name: 'Bambu Lab P1S',
      tag: 'Закритий корпус',
      img: '/images/printer/Bambu Lab P1S1.jpg',
      specs: [
        { label: 'Технологія', value: 'FDM (FFF)' },
        { label: 'Робоча область', value: '256×256×256 мм' },
        { label: 'Точність', value: '±0.1 мм' },
        { label: 'Швидкість', value: 'до 500 мм/с' },
        { label: 'Корпус', value: 'Закритий' },
        { label: 'Екран', value: '2.7"' },
      ],
      description: 'Закрита камера для друку інженерними пластиками. Висока швидкість та надійність у компактному корпусі.',
      color: '#4a9eff',
      featured: false,
    },
    {
      name: 'Bambu Lab P2S',
      tag: 'Покращена версія',
      img: '/images/printer/Bambu Lab P2S1.jpg',
      specs: [
        { label: 'Технологія', value: 'FDM (FFF)' },
        { label: 'Робоча область', value: '256×256×256 мм' },
        { label: 'Точність', value: '±0.1 мм' },
        { label: 'Швидкість', value: 'до 500 мм/с' },
        { label: 'Особливість', value: 'Покращена система охолодження' },
        { label: 'Екран', value: '2.7"' },
      ],
      description: 'Модернізована версія з покращеною системою охолодження та стабільністю друку для довготривалих проєктів.',
      color: '#7ec8a3',
      featured: false,
    },
    {
      name: 'Bambu Lab H2D',
      tag: 'Нове покоління',
      img: '/images/printer/Bambu Lab H2D1.jpg',
      specs: [
        { label: 'Технологія', value: 'FDM (FFF)' },
        { label: 'Робоча область', value: '300×300×300 мм' },
        { label: 'Точність', value: '±0.05 мм' },
        { label: 'Швидкість', value: 'до 600 мм/с' },
        { label: 'Особливість', value: 'Подвійний екструдер' },
        { label: 'Екран', value: '7" сенсорний' },
      ],
      description: 'Найновіша модель з подвійним екструдером, збільшеною робочою областю та високою точністю. Ідеальний для складних багатокомпонентних виробів.',
      color: '#ff6b6b',
      featured: false,
    },
  ];

  const flagship = printers.find(p => p.featured);
  const others = printers.filter(p => !p.featured);

  return (
    <div ref={ref} className="pt-32 pb-20 container-custom max-w-6xl mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block px-4 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-semibold mb-3"
        >
          🖨️ Наше обладнання
        </motion.span>
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">
          Принтери Bambu Lab
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Сучасні 3D-принтери для професійного та домашнього використання
        </p>
      </motion.div>

      {flagship && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={flagship.img}
                alt={flagship.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute top-4 left-4 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">
                {flagship.tag}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#1a3c34]">{flagship.name}</h2>
              <p className="text-gray-600 mt-2">{flagship.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {flagship.specs.map((spec, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{spec.label}</p>
                    <p className="font-semibold text-[#1a3c34] text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-4">
                <Button href="/order" variant="primary">Замовити друк</Button>
                <Button href="/gallery" variant="secondary">Дивитись роботи</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-[#1a3c34] text-center mb-8">Інші моделі Bambu Lab</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {others.map((printer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all flex flex-col h-full"
            >
              <div className="relative h-48 bg-gray-100 flex-shrink-0">
                <Image
                  src={printer.img}
                  alt={printer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#1a3c34]">
                  {printer.tag}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#1a3c34]">{printer.name}</h3>
                <p className="text-gray-500 text-sm mt-1 flex-1">{printer.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {printer.specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded-lg">
                      <p className="text-[10px] text-gray-400 uppercase">{spec.label}</p>
                      <p className="text-xs font-semibold text-[#1a3c34]">{spec.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button href="/order" variant="primary" className="w-full text-sm py-2">
                    Замовити друк
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-gray-500 text-sm mb-4">Готові замовити друк на одному з цих принтерів?</p>
        <Button href="/order" variant="primary" className="text-lg px-10 py-4">
          Перейти до замовлення
        </Button>
      </motion.div>
    </div>
  );
}