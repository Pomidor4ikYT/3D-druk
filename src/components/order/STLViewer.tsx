'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

// ===== ДОПОМІЖНІ ФУНКЦІЇ =====
function computeGeometryStats(geometry: THREE.BufferGeometry) {
  const pos = geometry.getAttribute('position');
  const index = geometry.getIndex();
  if (!pos) return { volume: 0, surfaceArea: 0, triangleCount: 0 };

  const vertices: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    vertices.push(pos.getX(i), pos.getY(i), pos.getZ(i));
  }

  const indices = index ? index.array : null;
  const triCount = indices ? indices.length / 3 : pos.count / 3;
  let volume = 0;
  let surfaceArea = 0;

  for (let i = 0; i < triCount; i++) {
    const a = indices ? indices[i * 3] * 3 : i * 9;
    const b = indices ? indices[i * 3 + 1] * 3 : i * 9 + 3;
    const c = indices ? indices[i * 3 + 2] * 3 : i * 9 + 6;

    const ax = vertices[a], ay = vertices[a+1], az = vertices[a+2];
    const bx = vertices[b], by = vertices[b+1], bz = vertices[b+2];
    const cx = vertices[c], cy = vertices[c+1], cz = vertices[c+2];

    const v321 = cx * by * az;
    const v231 = bx * cy * az;
    const v312 = cx * ay * bz;
    const v132 = ax * cy * bz;
    const v213 = bx * ay * cz;
    const v123 = ax * by * cz;
    volume += (-v321 + v231 + v312 - v132 - v213 + v123) / 6;

    const ab = new THREE.Vector3(bx-ax, by-ay, bz-az);
    const ac = new THREE.Vector3(cx-ax, cy-ay, cz-az);
    const cross = new THREE.Vector3().crossVectors(ab, ac);
    surfaceArea += cross.length() / 2;
  }

  return {
    volume: Math.abs(volume) / 1000,
    surfaceArea: surfaceArea / 100,
    triangleCount: Math.round(triCount),
  };
}

function getBoundingBox(geometry: THREE.BufferGeometry) {
  const box = new THREE.Box3().setFromBufferAttribute(geometry.getAttribute('position'));
  const min = box.min.clone().multiplyScalar(0.1);
  const max = box.max.clone().multiplyScalar(0.1);
  const size = new THREE.Vector3().copy(max).sub(min);
  return {
    min: { x: min.x, y: min.y, z: min.z },
    max: { x: max.x, y: max.y, z: max.z },
    dimensions: { width: size.x, height: size.y, depth: size.z },
  };
}

// ===== КОМПОНЕНТ МОДЕЛІ =====
function Model({ url, fileType, onLoaded }: { 
  url: string; 
  fileType: string;
  onLoaded: (data: any) => void;
}) {
  const [model, setModel] = useState<THREE.Object3D | THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    loadedRef.current = false;

    const loadModel = async () => {
      try {
        let LoaderClass: any;
        let isGLTF = false;

        switch (fileType) {
          case 'stl': {
            const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader');
            LoaderClass = STLLoader;
            break;
          }
          case 'obj': {
            const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader');
            LoaderClass = OBJLoader;
            break;
          }
          case 'ply': {
            const { PLYLoader } = await import('three/examples/jsm/loaders/PLYLoader');
            LoaderClass = PLYLoader;
            break;
          }
          case 'glb':
          case 'gltf': {
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
            LoaderClass = GLTFLoader;
            isGLTF = true;
            break;
          }
          case 'fbx': {
            const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader');
            LoaderClass = FBXLoader;
            break;
          }
          default:
            setError('Непідтримуваний формат');
            setLoading(false);
            return;
        }

        const loader = new LoaderClass();

        const onLoadSuccess = (result: any) => {
          if (!isMounted) return;
          let object: THREE.Object3D | THREE.BufferGeometry;
          let geometries: THREE.BufferGeometry[] = [];

          if (result.isBufferGeometry) {
            object = result;
            geometries = [result];
          } else if (result.isObject3D) {
            object = result;
            result.traverse((child: any) => {
              if (child.isMesh && child.geometry) {
                geometries.push(child.geometry);
              }
            });
          } else {
            setError('Невідомий тип моделі');
            setLoading(false);
            return;
          }

          if (geometries.length === 0) {
            setError('Не знайдено геометрії');
            setLoading(false);
            return;
          }

          // Об'єднуємо геометрії для аналізу
          let mergedGeo: THREE.BufferGeometry;
          if (geometries.length === 1) {
            mergedGeo = geometries[0];
          } else {
            const merged = new THREE.BufferGeometry();
            const positions: number[] = [];
            const normals: number[] = [];
            const uvs: number[] = [];
            for (const g of geometries) {
              const pos = g.getAttribute('position');
              if (pos) {
                for (let i = 0; i < pos.count; i++) {
                  positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
                }
              }
              const n = g.getAttribute('normal');
              if (n) {
                for (let i = 0; i < n.count; i++) {
                  normals.push(n.getX(i), n.getY(i), n.getZ(i));
                }
              }
              const uv = g.getAttribute('uv');
              if (uv) {
                for (let i = 0; i < uv.count; i++) {
                  uvs.push(uv.getX(i), uv.getY(i));
                }
              }
            }
            merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            if (normals.length) merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            if (uvs.length) merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            merged.computeVertexNormals();
            mergedGeo = merged;
          }

          const stats = computeGeometryStats(mergedGeo);
          const box = getBoundingBox(mergedGeo);

          const modelData = {
            volume: stats.volume,
            surfaceArea: stats.surfaceArea,
            triangleCount: stats.triangleCount,
            dimensions: box.dimensions,
            boundingBox: box,
          };

          // Центрування моделі для відображення
          if (result.isBufferGeometry) {
            const box3 = new THREE.Box3().setFromBufferAttribute(result.getAttribute('position'));
            const center = box3.getCenter(new THREE.Vector3());
            result.translate(-center.x, -center.y, -center.z);
            setModel(result);
          } else if (result.isObject3D) {
            const box3 = new THREE.Box3().setFromObject(result);
            const center = box3.getCenter(new THREE.Vector3());
            result.position.sub(center);
            result.traverse((child: any) => {
              if (child.isMesh && child.geometry) {
                const gBox = new THREE.Box3().setFromObject(child);
                const gCenter = gBox.getCenter(new THREE.Vector3());
                child.geometry.translate(-gCenter.x, -gCenter.y, -gCenter.z);
              }
            });
            setModel(result);
          }

          // Викликаємо onLoaded один раз
          if (!loadedRef.current) {
            loadedRef.current = true;
            onLoaded(modelData);
          }
          setLoading(false);
        };

        if (isGLTF) {
          loader.load(url, (gltf: any) => onLoadSuccess(gltf.scene), undefined, (err: any) => {
            console.error('GLTF помилка:', err);
            if (isMounted) { setError('Не вдалося завантажити модель'); setLoading(false); }
          });
        } else {
          loader.load(url, onLoadSuccess, undefined, (err: any) => {
            console.error('Помилка завантаження:', err);
            if (isMounted) { setError('Не вдалося завантажити модель'); setLoading(false); }
          });
        }
      } catch (err) {
        console.error('Критична помилка:', err);
        if (isMounted) { setError('Помилка завантаження'); setLoading(false); }
      }
    };

    if (url) loadModel();
    return () => { isMounted = false; };
  }, [url, fileType, onLoaded]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#c9a84c" wireframe />
      </mesh>
    );
  }

  if (error || !model) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ef4444" wireframe />
      </mesh>
    );
  }

  if (model.isBufferGeometry) {
    return (
      <mesh geometry={model}>
        <meshPhysicalMaterial 
          color="#c9a84c" 
          roughness={0.3} 
          metalness={0.05}
          clearcoat={0.1}
          envMapIntensity={0.6}
        />
      </mesh>
    );
  }

  if (model.isObject3D) {
    return <primitive object={model} />;
  }

  return null;
}

// ===== ГОЛОВНИЙ КОМПОНЕНТ =====
export default function STLViewer({ 
  file, 
  onModelLoaded 
}: { 
  file: File | null;
  onModelLoaded?: (data: any) => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      setError(null);
      setFileType('');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const supported = ['stl', 'obj', 'ply', 'glb', 'gltf', 'fbx'];
    if (!supported.includes(ext)) {
      setError(`Формат "${ext}" не підтримується. Доступні: ${supported.join(', ')}`);
      return;
    }
    setFileType(ext);

    try {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      setError(null);
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError('Не вдалося створити URL для файлу');
    }
  }, [file]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-xl text-red-500 border border-red-200 p-4 text-center">
        <div>
          <p className="font-semibold">Помилка перегляду моделі</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!file || !objectUrl) {
    return (
      <div 
        className={`flex items-center justify-center h-64 rounded-xl border-2 border-dashed transition-colors ${
          isDragging ? 'border-[#c9a84c] bg-[#c9a84c]/10' : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="text-center">
          <span className="text-5xl block mb-2">📁</span>
          <p className="text-gray-600 font-medium">Перетягніть модель сюди</p>
          <p className="text-gray-400 text-sm">STL, OBJ, PLY, GLB, GLTF, FBX</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <Canvas camera={{ position: [2, 1.5, 3], fov: 45 }}>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <directionalLight position={[-10, 5, -5]} intensity={0.6} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />
        <Grid 
          infiniteGrid 
          cellSize={0.5} 
          cellThickness={1} 
          sectionSize={3} 
          sectionThickness={2}
          fadeDistance={10}
          fadeStrength={1}
        />
        <OrbitControls 
          enableRotate={true} 
          autoRotate={false}
          minDistance={0.5}
          maxDistance={20}
          enableDamping
          dampingFactor={0.1}
        />
        <Model url={objectUrl} fileType={fileType} onLoaded={onModelLoaded || (() => {})} />
        <Environment preset="studio" background={false} />
      </Canvas>
      <div className="absolute bottom-3 left-3 text-xs text-white/50 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
        {file.name} • {(file.size / 1024).toFixed(1)} KB
      </div>
      <div className="absolute bottom-3 right-3 text-xs text-white/30 bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
        🖱 Обертай • 🔄 Масштабуй
      </div>
    </div>
  );
}