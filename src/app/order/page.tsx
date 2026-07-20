'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/forms/FileUpload';
import CalculatorModal from '@/components/order/CalculatorModal';
import DeliverySelector from '@/components/order/DeliverySelector';
import STLViewer from '@/components/order/STLViewer';

// ==================== ЦІНИ МАТЕРІАЛІВ ====================
const materialPrices: Record<string, number> = {
  PLA: 6,
  PETG: 7,
  ABS: 7,
  ASA: 8,
  TPU: 10,
  'PA (нейлон)': 15,
};

// ==================== ДОЗВОЛЕНІ ФОРМАТИ ФАЙЛІВ ====================
const ALLOWED_FILE_TYPES = ['stl', 'obj', '3mf', 'step', 'iges', 'stp'];
const ALLOWED_FILE_EXTENSIONS = ALLOWED_FILE_TYPES.map(ext => `.${ext}`).join(',');

// ==================== КОМПОНЕНТ ====================
export default function OrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    delivery: 'nova' as 'nova' | 'ukr' | 'pickup',
    city: '',
    warehouse: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [calcOpen, setCalcOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIndividualModal, setShowIndividualModal] = useState(false);

  // ==================== ПАРАМЕТРИ ДРУКУ ====================
  const [material, setMaterial] = useState('PLA');
  const [weight, setWeight] = useState(50);
  const [quantity, setQuantity] = useState(1);
  const [infill, setInfill] = useState(20);
  const [perimeters, setPerimeters] = useState(2);
  const [layerHeight, setLayerHeight] = useState(0.2);

  const [modelInfo, setModelInfo] = useState<any>(null);
  const loadedRef = useRef(false);

  // ==================== СТАН ПОМИЛОК ====================
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    city?: string;
    warehouse?: string;
    file?: string;
    weight?: string;
    quantity?: string;
  }>({});

  // ==================== РОЗРАХУНОК ЦІНИ ====================
  const calculatePrice = () => {
    const basePricePerGram = materialPrices[material] || 6;
    const baseTotal = basePricePerGram * weight * quantity;

    const infillFactor = 1 + (infill / 100) * 0.01;
    const perimeterFactor = 1 + (perimeters - 1) * 0.02;
    const layerFactor = 1 + (0.2 / layerHeight - 1) * 0.005;

    let price = baseTotal * infillFactor * perimeterFactor * layerFactor;

    let discount = 0;
    if (quantity >= 500) discount = 0.20;
    else if (quantity >= 100) discount = 0.15;
    else if (quantity >= 50) discount = 0.10;
    else if (quantity >= 10) discount = 0.05;

    const discountedPrice = price * (1 - discount);

    return {
      baseTotal,
      priceWithParams: price,
      discount,
      discountedPrice,
      finalPrice: Math.round(discountedPrice),
      infillFactor,
      perimeterFactor,
      layerFactor,
    };
  };

  const priceData = calculatePrice();

  // ==================== ВАЛІДАЦІЯ ====================
  const validateForm = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Будь ласка, введіть ваше ім'я";
    if (!form.phone.trim()) newErrors.phone = "Будь ласка, введіть номер телефону";
    if (form.delivery !== 'pickup') {
      if (!form.city.trim()) newErrors.city = 'Введіть місто доставки';
      if (!form.warehouse.trim()) newErrors.warehouse = 'Введіть відділення доставки';
    }
    if (!file) newErrors.file = 'Будь ласка, завантажте файл моделі (STL, OBJ, 3MF)';
    if (weight <= 0) newErrors.weight = 'Вага має бути більше 0';
    if (quantity < 1) newErrors.quantity = 'Кількість має бути не менше 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== ВІДПРАВЛЕННЯ ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setStatus('Надсилання...');

    try {
      let fileUrl = '';
      let fileName = '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || 'Помилка завантаження файлу');
        }

        const uploadData = await uploadRes.json();
        fileUrl = uploadData.fileUrl;
        fileName = uploadData.fileName;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email || '',
            comment: form.description,
          },
          delivery: {
            type: form.delivery,
            city: form.city,
            warehouse: form.warehouse,
          },
          items: [
            {
              title: '3D-друк на замовлення',
              material,
              weight,
              quantity,
              infill,
              perimeters,
              layerHeight,
              file: fileUrl || file?.name || '',
              fileName: fileName || file?.name || '',
              totalPrice: priceData.finalPrice,
            },
          ],
          total: priceData.finalPrice,
          source: 'form',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const orderData = {
          id: data.id || `ORDER-${Date.now()}`,
          customer: {
            name: form.name,
            phone: form.phone,
            email: form.email || '',
            comment: form.description,
          },
          delivery: {
            type: form.delivery,
            city: form.city,
            warehouse: form.warehouse,
          },
          items: [
            {
              title: '3D-друк на замовлення',
              material,
              weight,
              quantity,
              infill,
              perimeters,
              layerHeight,
              file: fileUrl || file?.name || '',
              fileName: fileName || file?.name || '',
              price: priceData.finalPrice,
            },
          ],
          total: priceData.finalPrice,
          created_at: new Date().toISOString(),
        };
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        setStatus('');
        setForm({ name: '', phone: '', email: '', delivery: 'nova', city: '', warehouse: '', description: '' });
        setFile(null);
        setModelInfo(null);
        loadedRef.current = false;
        router.push('/order-confirmation');
      } else {
        const errData = await res.json();
        setStatus(`❌ ${errData.error || 'Помилка при надсиланні замовлення'}`);
      }
    } catch (e: any) {
      setStatus(`❌ ${e.message || 'Помилка з\'єднання. Перевірте інтернет.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== ОБРОБКА ФАЙЛУ ====================
  const handleFileSelect = (file: File | null) => {
    setFile(file);
    if (!file) {
      setModelInfo(null);
      loadedRef.current = false;
    }
    if (errors.file) setErrors(prev => ({ ...prev, file: undefined }));
  };

  const handleModelLoaded = (data: any) => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setModelInfo(data);
  };

  // Автоматичне очищення помилок
  useEffect(() => {
    if (form.name.trim() && errors.name) setErrors(prev => ({ ...prev, name: undefined }));
  }, [form.name]);

  useEffect(() => {
    if (form.phone.trim() && errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
  }, [form.phone]);

  useEffect(() => {
    if (form.city.trim() && errors.city) setErrors(prev => ({ ...prev, city: undefined }));
  }, [form.city]);

  useEffect(() => {
    if (form.warehouse.trim() && errors.warehouse) setErrors(prev => ({ ...prev, warehouse: undefined }));
  }, [form.warehouse]);

  useEffect(() => {
    if (weight > 0 && errors.weight) setErrors(prev => ({ ...prev, weight: undefined }));
  }, [weight]);

  useEffect(() => {
    if (quantity >= 1 && errors.quantity) setErrors(prev => ({ ...prev, quantity: undefined }));
  }, [quantity]);

  useEffect(() => {
    if (file) setErrors(prev => ({ ...prev, file: undefined }));
  }, [file]);

  return (
    <div className="pt-32 pb-20 container-custom max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-[#1a3c34] mb-4 font-heading text-4xl">Замовити 3D-друк</h1>
        <p className="text-gray-600 text-lg">Заповніть форму, завантажте файл і ми розрахуємо вартість</p>
        <button onClick={() => setCalcOpen(true)} className="mt-4 text-[#c9a84c] font-semibold underline hover:no-underline">
          Попередньо розрахувати вартість →
        </button>
        <div className="mt-4 inline-block bg-gray-100 px-6 py-2 rounded-full text-sm text-gray-700 border border-gray-200">
          📐 Макс. розмір моделі: 25,6 × 25,6 × 25,6 см (об'єм ~16,8 л)
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== ОСОБИСТІ ДАНІ ===== */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ваше ім’я <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Іван Петренко"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full p-3 bg-gray-50 rounded-xl border ${
                  errors.name ? 'border-red-500 ring-2 ring-red-500/30' : 'border-gray-200'
                } focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+38 098 0751707"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full p-3 bg-gray-50 rounded-xl border ${
                  errors.phone ? 'border-red-500 ring-2 ring-red-500/30' : 'border-gray-200'
                } focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (необов'язково)</label>
            <input
              type="email"
              placeholder="ivan@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          {/* ===== ДОСТАВКА ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Спосіб доставки</label>
            <DeliverySelector
              value={{
                city: form.city,
                warehouse: form.warehouse,
                deliveryType: form.delivery,
              }}
              onChange={(val) => {
                setForm({
                  ...form,
                  city: val.city,
                  warehouse: val.warehouse,
                  delivery: val.deliveryType,
                });
                if (errors.city || errors.warehouse) {
                  setErrors(prev => ({ ...prev, city: undefined, warehouse: undefined }));
                }
              }}
            />
            {form.delivery !== 'pickup' && (
              <div className="mt-2">
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                {errors.warehouse && <p className="text-red-500 text-sm mt-1">{errors.warehouse}</p>}
              </div>
            )}
          </div>

          {/* ===== ОПИС ЗАМОВЛЕННЯ ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис замовлення</label>
            <textarea
              placeholder="Вкажіть розміри, бажаний матеріал, колір, кількість..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          {/* ===== ПАРАМЕТРИ ДРУКУ ===== */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-semibold text-[#1a3c34] flex items-center gap-2">🧮 Параметри друку</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Матеріал</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                >
                  {Object.keys(materialPrices).map((m) => (
                    <option key={m} value={m}>{m} ({materialPrices[m]} ₴/г)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Вага моделі (г) *</label>
                <input
                  type="number"
                  name="weight"
                  min="1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className={`w-full p-2 bg-white rounded-lg border ${
                    errors.weight ? 'border-red-500 ring-2 ring-red-500/30' : 'border-gray-200'
                  } focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition`}
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                {modelInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    Об'єм: {modelInfo.volume?.toFixed(2)} см³ (прибл. вага: {(modelInfo.volume * 1.24).toFixed(1)} г)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Кількість</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-2 bg-white rounded-lg border ${
                    errors.quantity ? 'border-red-500 ring-2 ring-red-500/30' : 'border-gray-200'
                  } focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition`}
                />
                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Заповнення (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={infill}
                  onChange={(e) => setInfill(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{infill}%</span>
                  <span>рекомендовано: 20%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Периметри</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={perimeters}
                  onChange={(e) => setPerimeters(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{perimeters}</span>
                  <span>рекомендовано: 2</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Висота шару (мм)</label>
                <select
                  value={layerHeight}
                  onChange={(e) => setLayerHeight(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                >
                  <option value={0.05}>0.05 (дуже висока точність)</option>
                  <option value={0.1}>0.1 (висока)</option>
                  <option value={0.15}>0.15 (середня)</option>
                  <option value={0.2}>0.2 (стандарт)</option>
                  <option value={0.3}>0.3 (швидкий)</option>
                </select>
              </div>
            </div>

            {/* ===== БЛОК ЗНИЖОК ===== */}
            <div className="bg-gradient-to-r from-[#1a3c34] to-[#2d5a4b] rounded-xl p-4 text-white shadow-lg w-full">
              <h5 className="font-bold text-[#c9a84c] flex items-center gap-2 mb-2">
                <span className="text-xl">🎯</span>
                <span>Для постійних клієнтів</span>
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
                  <div className="text-xl font-bold text-[#7ec8a3]">10+</div>
                  <div className="text-xs text-white/70">виробів</div>
                  <div className="text-base font-bold text-[#c9a84c]">-5%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
                  <div className="text-xl font-bold text-[#7ec8a3]">50+</div>
                  <div className="text-xs text-white/70">виробів</div>
                  <div className="text-base font-bold text-[#c9a84c]">-10%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
                  <div className="text-xl font-bold text-[#7ec8a3]">100+</div>
                  <div className="text-xs text-white/70">виробів</div>
                  <div className="text-base font-bold text-[#c9a84c]">-15%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10 border-dashed">
                  <div className="text-xl font-bold text-[#c9a84c]">500+</div>
                  <div className="text-xs text-white/70">виробів</div>
                  <button
                    type="button"
                    onClick={() => setShowIndividualModal(true)}
                    className="text-xs font-semibold text-[#7ec8a3] hover:underline cursor-pointer"
                  >
                    індивідуально →
                  </button>
                </div>
              </div>
              {quantity >= 500 && (
                <div className="mt-2 text-xs text-[#c9a84c] font-semibold animate-pulse">
                  🎉 Для 500+ виробів – індивідуальний договір.{' '}
                  <button type="button" onClick={() => setShowIndividualModal(true)} className="underline">
                    Деталі
                  </button>
                </div>
              )}
            </div>

            {/* ===== РОЗРАХУНОК ===== */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Орієнтовна вартість:</p>
              <p className="text-3xl font-bold text-[#1a3c34]">{priceData.finalPrice} ₴</p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mt-2">
                <span>База: {priceData.baseTotal.toFixed(0)} ₴</span>
                <span>Заповнення: {(priceData.infillFactor * 100 - 100).toFixed(0)}%</span>
                <span>Периметри: {(priceData.perimeterFactor * 100 - 100).toFixed(0)}%</span>
                {priceData.discount > 0 && (
                  <span className="text-green-600 font-medium">Знижка: {(priceData.discount * 100).toFixed(0)}%</span>
                )}
              </div>
              {priceData.discount > 0 && <p className="text-xs text-green-700 mt-1">✅ Застосовано знижку за кількість</p>}
              <p className="text-xs text-gray-400 mt-1">* Розрахунок приблизний, остаточна ціна після узгодження</p>
            </div>
          </div>

          {/* ===== ФАЙЛ ===== */}
          <div className="file-upload-container">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Файл моделі <span className="text-red-500">*</span>
            </label>
            <FileUpload
              key={file ? 'has-file' : 'no-file'}
              onFileSelect={handleFileSelect}
              accept={ALLOWED_FILE_EXTENSIONS}
              allowedExtensions={ALLOWED_FILE_TYPES}
              maxSize={50 * 1024 * 1024}
              label="Перетягніть 3D-модель або клікніть для вибору"
              required={false}
            />
            {file && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-[#1a3c34] text-sm">✅ Вибрано: {file.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setModelInfo(null);
                    loadedRef.current = false;
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  ✕
                </button>
              </div>
            )}
            {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
            <p className="text-xs text-gray-400 mt-1">
              Дозволені формати: STL, OBJ, 3MF, STEP, IGES, STP. Макс. розмір: 50 МБ
            </p>
          </div>

          {file && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Попередній перегляд моделі</label>
              <STLViewer file={file} onModelLoaded={handleModelLoaded} />
              {modelInfo && (
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div>Об'єм: {modelInfo.volume?.toFixed(2)} см³</div>
                  <div>Розміри: {modelInfo.dimensions?.width?.toFixed(1)}×{modelInfo.dimensions?.height?.toFixed(1)}×{modelInfo.dimensions?.depth?.toFixed(1)} см</div>
                  <div>Трикутників: {modelInfo.triangleCount?.toLocaleString()}</div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                * Об'єм, розміри та кількість трикутників не впливають на ціну – це довідкова інформація.
              </p>
            </div>
          )}

          {/* ===== УМОВИ ===== */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-sm text-red-700">
            ⚠️ Повернення браку можливе при наявності відеофіксації несправності при розпаковці.
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full py-4 text-lg shadow-lg shadow-[#1a3c34]/20"
          >
            {isSubmitting ? 'Надсилання...' : 'Надіслати заявку'}
          </Button>
          {status && (
            <p className={`text-center font-medium ${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-[#1a3c34]'}`}>
              {status}
            </p>
          )}
        </form>
      </div>

      {/* ===== МОДАЛКА ===== */}
      {showIndividualModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowIndividualModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1a3c34] flex items-center gap-2">
                <span className="text-2xl">📐</span>
                Індивідуальні розробки
              </h3>
              <button
                onClick={() => setShowIndividualModal(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl transition"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Формула розрахунку:</span>
              </p>
              <p className="font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                (матеріал × вага × кількість) × заповнення × периметри × висота шару
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-gray-700">
                <p className="font-semibold">📌 Для 500+ виробів:</p>
                <p>Застосовується індивідуальний договір з персоналізованими умовами.</p>
                <p className="text-xs text-gray-500 mt-1">Зв'яжіться з нами для детального розрахунку.</p>
              </div>
              <button
                onClick={() => setShowIndividualModal(false)}
                className="w-full py-2 bg-[#1a3c34] text-white rounded-lg font-medium hover:bg-[#2d5a4b] transition"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        </div>
      )}

      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
    </div>
  );
}