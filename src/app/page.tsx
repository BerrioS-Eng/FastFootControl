'use client'
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const mapElementsData = [
  {
    id: 'home',
    x: 0,
    y: 0,
    title: 'Bienvenido a Deli Chicharrones',
    description: 'Los chicharrones más crujientes y sabrosos, preparados como en casa.',
    bgClass: 'bg-white/90 backdrop-blur-sm',
    textClass: 'text-gray-800',
  },
  {
    id: 'about',
    x: -460,
    y: -460,
    title: 'Sobre Nosotros',
    description: 'Somos un negocio familiar donde cada plato se prepara con cariño y tradición.',
    bgClass: 'bg-gradient-to-br from-purple-500 to-pink-500',
    textClass: 'text-white',
    image: '/sobre_nosotros.jpeg',
  },
  {
    id: 'contact',
    x: -600,
    y: 200,
    title: 'Contacto',
    bgClass: 'bg-gradient-to-br from-orange-500 to-red-500',
    textClass: 'text-white',
    contacts: [
      { icon: '📧', text: 'delichicharronespr@gmail.com' },
      { icon: '📱', text: '+57 (323) 479-8248' },
      { icon: '📍', text: 'Planeta Rica, Córdoba, Colombia' },
    ],
  },
];

const socialLinks = [
  { name: 'Facebook', icon: 'f', bgClass: 'bg-blue-600 hover:bg-blue-700' },
  { name: 'Instagram', icon: '📷', bgClass: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90' },
  { name: 'WhatsApp', icon: '/icons8-whatsapp-48.png', bgClass: 'bg-blue-400 hover:bg-blue-500', isImage: true },
];

export default function Home() {
  const { logout, isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Limpiar cualquier sesión existente al cargar la página principal
  useEffect(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }, []);

  // Nota: Redirección automática eliminada para permitir acceso libre a la página principal
  
  // Función para limpiar la sesión si existe
  const clearSession = () => {
    logout();
    // También limpiar manualmente cualquier dato residual
    localStorage.clear();
    window.location.reload();
  };

  // Función para renderizar el contenido de cada elemento
  const renderMapElement = (element: typeof mapElementsData[0]) => {
    switch (element.id) {
      case 'home':
        return (
          <div className={`${element.bgClass} rounded-xl p-4 sm:p-6 shadow-2xl max-w-xs sm:max-w-md`}>
            <h2 className={`text-xl sm:text-3xl font-bold ${element.textClass} mb-4`}>¡Bienvenido!</h2>
            <p className={`${element.textClass} mb-4 text-sm sm:text-base opacity-80`}>
              {element.description}
            </p>
            <div className="flex gap-2 justify-center">
              {[0.2, 0.4, 0.6].map((delay, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 ${['bg-amber-600', 'bg-orange-600', 'bg-red-500'][i]} rounded-full animate-pulse`}
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className={`${element.bgClass} rounded-xl p-4 sm:p-6 shadow-2xl max-w-xs sm:max-w-md ${element.textClass}`}>
            <h2 className="text-xl sm:text-3xl font-bold mb-4">👋 {element.title}</h2>
            <p className="mb-4 text-sm sm:text-base">{element.description}</p>
            {element.image && (
              <div className="flex justify-center">
                <Image
                  alt={element.title}
                  src={element.image}
                  width={250}
                  height={200}
                  className="rounded-md object-cover w-full max-w-[250px]"
                />
              </div>
            )}
          </div>
        );
      
      case 'contact':
        return (
          <div className={`${element.bgClass} rounded-xl p-4 sm:p-6 shadow-2xl max-w-xs sm:max-w-md ${element.textClass}`}>
            <h2 className="text-xl sm:text-3xl font-bold mb-4">� {element.title}</h2>
            <div className="space-y-2 sm:space-y-3">
              {element.contacts?.map((contact, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/20 rounded-lg p-2 sm:p-3">
                  <span className="text-lg">{contact.icon}</span>
                  <span className="text-xs sm:text-sm break-all">{contact.text}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-white text-orange-500 font-bold py-2 sm:py-3 rounded-lg mt-4 hover:bg-gray-100 transition-colors text-sm sm:text-base">
              Enviar Mensaje
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Elementos adicionales del mapa
  const socialElement = {
    id: 'social',
    x: 500,
    y: -200,
    content: (
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-2xl max-w-xs sm:max-w-md text-white">
        <h2 className="text-lg sm:text-2xl font-bold mb-4">� Síguenos</h2>
        <div className="space-y-2 sm:space-y-3">
          {socialLinks.map((social, index) => (
            <a key={index} href="#" className={`flex items-center gap-3 ${social.bgClass} rounded-lg p-2 sm:p-3 transition-all`}>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                {social.isImage ? (
                  <Image alt={social.name} src={social.icon} width={24} height={24} />
                ) : (
                  <span className="text-blue-600 font-bold text-sm sm:text-base">{social.icon}</span>
                )}
              </div>
              <span className="text-sm sm:text-base">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    )
  };

  // Combinar todos los elementos del mapa
  const mapElements = [
    ...mapElementsData.map(element => ({
      ...element,
      content: renderMapElement(element)
    })),
    socialElement
  ];

  const getEventCoordinates = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): { x: number, y: number } => {
    if ('touches' in e) {
      // Es un TouchEvent (nativo o sintético)
      const touches = e.touches;
      return {
        x: touches[0].clientX,
        y: touches[0].clientY
      };
    } else {
      // Es un MouseEvent (nativo o sintético)
      return {
        x: e.clientX,
        y: e.clientY
      };
    }
  };

  // Función auxiliar para prevenir default si es posible
  const preventDefaultIfPossible = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
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

  // Función principal de manejo de mouse/touch down
  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    // Solo permitir drag en el fondo, no en los elementos
    // if (e.target.closest('.map-element')) return;
    
    setIsDragging(true);
    const { x: clientX, y: clientY } = getEventCoordinates(e);
    
    if ('touches' in e) {
      preventDefaultIfPossible(e);
    }

    setStartPos({
      x: clientX - offset.x,
      y: clientY - offset.y
    });
  };

  // Función principal de manejo de mouse/touch move
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const { x: clientX, y: clientY } = getEventCoordinates(e);
    
    if ('touches' in e) {
      preventDefaultIfPossible(e);
    }

    const newOffset = {
      x: clientX - startPos.x,
      y: clientY - startPos.y
    };

    // Limitar el movimiento
    newOffset.x = Math.max(-800, Math.min(800, newOffset.x));
    newOffset.y = Math.max(-600, Math.min(600, newOffset.y));

    setOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Effect para manejar eventos globales nativos del DOM
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
      // Event listeners nativos para eventos globales
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
  }, [isDragging, startPos]);

  return (
    <div
      ref={containerRef}
      className={`font-sans min-h-screen relative bg-gradient-to-br from-amber-300 to-amber-400 overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={handleReactMouseDown}
      onTouchStart={handleReactTouchStart}
      style={{
        touchAction: 'none', // Previene gestos nativos del navegador
      }}
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

          >
            {element.content}
          </div>
        ))}
      </div>

      <Navbar/>

      {/* Instrucciones responsive */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 bg-black/30 backdrop-blur-sm rounded-lg p-2 sm:p-4 text-white z-20 pointer-events-auto max-w-[calc(100vw-2rem)] sm:max-w-none">
        <div className="text-xs sm:text-sm space-y-1">
          <div className="flex items-center gap-1">
            <span>🖱️</span>
            <span className="hidden sm:inline">Arrastra para explorar</span>
            <span className="sm:hidden">Arrastra</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎯</span>
            <span className="hidden sm:inline">Sitúate sobre elementos</span>
            <span className="sm:hidden">Toca elementos</span>
          </div>
          <div className="hidden sm:block">🔒 Página principal - Haz clic en "Iniciar Sesión"</div>
          {isAuthenticated && (
            <button 
              onClick={clearSession}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs mt-2"
            >
              🚪 Limpiar sesión activa
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
