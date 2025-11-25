'use client'
import Navbar from '@/components/dashboard/Navbar';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredElement, setHoveredElement] = useState("");
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Posición inicial del drag usando ref (evita depender de un objeto en el efecto)
    const startPosRef = useRef({ x: 0, y: 0 });

    // Definir elementos en diferentes ubicaciones del mapa 2D
    const mapElements = [
        {
            id: 'home',
            type: 'home',
            x: 0,
            y: 0,
            title: 'Inicio',
            content: (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Bienvenido!</h2>
                    <p className="text-gray-600 mb-4">
                        Aquí encontrarás los chicharrones más crujientes y sabrosos, preparados como en casa. <br />
                        Te invitamos a probar nuestra especialidad y vivir una experiencia única de sabor.
                    </p>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            )
        },
        {
            id: 'about',
            type: 'about',
            x: -460,
            y: -460,
            title: 'Sobre Mí',
            content: (
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-2xl max-w-md text-white">
                    <h2 className="text-3xl font-bold mb-4">👋 Sobre Nosotros</h2>
                    <p className="mb-4">
                        Nuestra historia comenzó en casa, con mamá perfeccionando la receta familiar de chicharrones que ahora queremos compartir contigo. <br />
                        Somos un negocio familiar donde cada plato se prepara con cariño y la tradición que solo una madre puede transmitir.
                    </p>
                    <div className="flex justify-center gap-4 text-sm">
                        <Image
                            alt='sobre_nosotros'
                            src='/sobre_nosotros.jpeg'
                            width={300}
                            height={300}
                            className='rounded-md object-cover'
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'social',
            type: 'social',
            x: 500,
            y: -200,
            title: 'Redes Sociales',
            content: (
                <div className="bg-gray-900 rounded-xl p-6 shadow-2xl max-w-md text-white">
                    <h2 className="text-2xl font-bold mb-4">📱 Síguenos</h2>
                    <div className="space-y-3">
                        <a href="#" className="flex items-center gap-3 bg-blue-600 rounded-lg p-3 hover:bg-blue-700 transition-colors">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold">f</div>
                            <span>Facebook</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 hover:opacity-90 transition-opacity">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-600 font-bold">📷</div>
                            <span>Instagram</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 bg-blue-400 rounded-lg p-3 hover:bg-blue-500 transition-colors">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <Image
                                    alt='whatsapp image'
                                    src='/icons8-whatsapp-48.png'
                                    width={48}
                                    height={48}
                                />
                            </div>
                            <span>Whatsapp</span>
                        </a>
                    </div>
                </div>
            )
        },
        {
            id: 'projects',
            type: 'projects',
            x: 300,
            y: 400,
            title: 'Proyectos',
            content: (
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 shadow-2xl max-w-md text-white">
                    <h2 className="text-3xl font-bold mb-4">🍴 Menú</h2>
                    <div className="space-y-4">
                        <div className="bg-white/20 rounded-lg p-4">
                            <h3 className="font-bold text-lg">App E-commerce</h3>
                            <p className="text-sm opacity-90 mb-2">Plataforma completa con React y Node.js</p>
                            <div className="flex gap-2">
                                <span className="bg-white/30 px-2 py-1 rounded text-xs">React</span>
                                <span className="bg-white/30 px-2 py-1 rounded text-xs">Node.js</span>
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <h3 className="font-bold text-lg">Dashboard Analytics</h3>
                            <p className="text-sm opacity-90 mb-2">Visualización de datos en tiempo real</p>
                            <div className="flex gap-2">
                                <span className="bg-white/30 px-2 py-1 rounded text-xs">Vue.js</span>
                                <span className="bg-white/30 px-2 py-1 rounded text-xs">D3.js</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'contact',
            type: 'contact',
            x: -600,
            y: 200,
            title: 'Contacto',
            content: (
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 shadow-2xl max-w-md text-white">
                    <h2 className="text-3xl font-bold mb-4">📬 Contacto</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
                            <span>📧</span>
                            <span>delichicharronespr@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
                            <span>📱</span>
                            <span>+57 (323) 479-8248</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
                            <span>📍</span>
                            <span>Planeta Rica, Córdoba, Colombia</span>
                        </div>
                    </div>
                    <button className="w-full bg-white text-orange-500 font-bold py-3 rounded-lg mt-4 hover:bg-gray-100 transition-colors">
                        Enviar Mensaje
                    </button>
                </div>
            )
        },
        {
            id: 'skills',
            type: 'skills',
            x: -200,
            y: 500,
            title: 'Habilidades',
            content: (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-2xl max-w-md text-white">
                    <h2 className="text-3xl font-bold mb-4">✍ Receta</h2>
                    <div className="space-y-3">
                        <div className="bg-white/20 rounded-lg p-3">
                            <div className="flex justify-between mb-2">
                                <span>Amor 🧡</span>
                                <span>90%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                            <div className="flex justify-between mb-2">
                                <span>Pasión 😋</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                            <div className="flex justify-between mb-2">
                                <span>Familia 🙌</span>
                                <span>80%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const getEventCoordinates = (
        e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
    ): { x: number; y: number } => {
        if ('touches' in e) {
            const touches = e.touches;
            return {
                x: touches[0].clientX,
                y: touches[0].clientY,
            };
        } else {
            return {
                x: (e as MouseEvent | React.MouseEvent).clientX,
                y: (e as MouseEvent | React.MouseEvent).clientY,
            };
        }
    };

    // Función auxiliar para prevenir default si es posible
    const preventDefaultIfPossible = (
        e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
    ) => {
        if ('preventDefault' in e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
    };

    // Handlers para eventos sintéticos de React (para el elemento inicial)
    const handleReactMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleMouseDown(e.nativeEvent);
    };

    const handleReactTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        handleMouseDown(e.nativeEvent);
    };

    // Mouse/touch down: inicia drag
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
        setIsDragging(true);
        const { x: clientX, y: clientY } = getEventCoordinates(e);

        if ('touches' in e) {
            preventDefaultIfPossible(e);
        }

        // Guardar posición inicial en el ref (no en estado)
        startPosRef.current = {
            x: clientX - offset.x,
            y: clientY - offset.y,
        };
    };

    // Mouse/touch move: aplica desplazamiento
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        const { x: clientX, y: clientY } = getEventCoordinates(e);

        if ('touches' in e) {
            preventDefaultIfPossible(e);
        }

        const start = startPosRef.current;
        const newOffset = {
            x: clientX - start.x,
            y: clientY - start.y,
        } as { x: number; y: number } & Record<string, number>;

        // Limitar el movimiento
        newOffset.x = Math.max(-800, Math.min(800, newOffset.x));
        newOffset.y = Math.max(-600, Math.min(600, newOffset.y));

        setOffset({ x: newOffset.x, y: newOffset.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Listeners globales con deps de longitud constante
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            handleMouseMove(e);
        };

        const handleGlobalMouseUp = () => {
            handleMouseUp();
        };

        const handleGlobalTouchMove = (e: TouchEvent) => {
            handleMouseMove(e);
        };

        const handleGlobalTouchEnd = () => {
            handleMouseUp();
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);

            document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
            document.addEventListener('touchend', handleGlobalTouchEnd);
            document.addEventListener('touchcancel', handleGlobalTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);

            document.removeEventListener('touchmove', handleGlobalTouchMove);
            document.removeEventListener('touchend', handleGlobalTouchEnd);
            document.removeEventListener('touchcancel', handleGlobalTouchEnd);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={`font-sans min-h-screen relative bg-gradient-to-br from-amber-300 to-amber-300 overflow-hidden select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleReactMouseDown}
            onTouchStart={handleReactTouchStart}
            style={{ touchAction: 'none' }}
        >
            {/* Fondo animado con grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.6) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.6) 2px, transparent 2px)
          `,
                    backgroundSize: '70px 70px',
                    transform: `translate(${offset.x * 0.001}px, ${offset.y * 0.001}px)`,
                }}
            />

            {/* Contenedor de elementos del mapa */}
            <div className="absolute inset-0">
                {mapElements.map((element) => (
                    <div
                        key={element.id}
                        className="map-element absolute transition-all duration-200 hover:scale-105"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(calc(-50% + ${element.x + offset.x}px), calc(-50% + ${element.y + offset.y}px))`,
                        }}
                        onMouseEnter={() => setHoveredElement(element.id)}
                        onMouseLeave={() => setHoveredElement("")}
                    >
                        {element.content}
                    </div>
                ))}
            </div>

            <Navbar/>

            {/* Instrucciones */}
            <div className="fixed bottom-6 left-6 bg-black/30 backdrop-blur-sm rounded-lg p-4 text-white z-20 pointer-events-auto">
                <div className="text-sm space-y-1">
                    <div>🖱️ Arrastra para explorar</div>
                    <div>🎯 Situate sobre elementos para destacar</div>
                </div>
            </div>
        </div>
    );
}