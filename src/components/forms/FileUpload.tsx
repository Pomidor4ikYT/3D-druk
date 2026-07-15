'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

// Список підтримуваних 3D-форматів (для перегляду)
const supportedExtensions = ['stl', 'obj', 'ply', 'glb', 'gltf', 'fbx'];
// Додаткові формати для завантаження (наприклад, зображення, архіви) – їх можна завантажити, але 3D-перегляд недоступний
// Для простоти обмежуємо лише підтримуваними, щоб уникнути помилок
const allowedExtensions = supportedExtensions;

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      alert(
        `Будь ласка, завантажте файл у форматі: ${supportedExtensions.join(', ')}.\nАрхіви (RAR, ZIP) не підтримуються – розпакуйте їх перед завантаженням.`
      );
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Файл занадто великий. Максимальний розмір – 100MB');
      return;
    }

    onFileSelect(file);
    setFileName(file.name);

    // Для зображень – показуємо прев'ю
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    if (imageExtensions.includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setFileName(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
          dragActive ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-gray-300 bg-gray-50 hover:border-[#c9a84c]'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={`.${supportedExtensions.join(',.')}`}
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="hidden"
        />

        {!fileName ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-5xl">📁</span>
            <p className="text-gray-600 font-medium">Перетягніть файл або клікніть для вибору</p>
            <p className="text-gray-400 text-sm">
              {supportedExtensions.map(e => `.${e}`).join(', ')}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {preview ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#1a3c34]/10 flex items-center justify-center text-3xl flex-shrink-0">
                📄
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
              <p className="text-xs text-gray-400">Натисніть для заміни</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-red-500 hover:text-red-700 transition p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}