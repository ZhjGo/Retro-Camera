import React, { useState } from 'react';
import RetroCamera from './components/RetroCamera';
import PhotoCard from './components/PhotoCard';
import { generateCaption } from './services/ai';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';

function AppContent() {
  const [photos, setPhotos] = useState([]);
  const { t, language } = useLanguage();

  const handlePhotoTaken = async (imageSrc) => {
    const newPhoto = {
      id: Date.now(),
      imageSrc,
      date: new Date().toLocaleDateString(),
      caption: 'photo.developing', // Store key, translate in component
      isNew: true,
      x: window.innerWidth < 768 ? '50%' : 0, // Center on mobile
      y: 0
    };
    setPhotos(prev => [...prev, newPhoto]);

    // Trigger AI caption
    try {
      const caption = await generateCaption(imageSrc, language);
      setPhotos(prev => prev.map(p => p.id === newPhoto.id ? { ...p, caption } : p));
    } catch (error) {
      console.error("AI Error", error);
      setPhotos(prev => prev.map(p => p.id === newPhoto.id ? { ...p, caption: 'photo.default_caption' } : p));
    }
  };

  const handleDragStart = (id) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, isNew: false } : p));
  };

  const handleDragEnd = (id, point) => {
    // Update position if needed, though Framer Motion handles visual position.
    // If we want to persist position, we'd update x/y here.
    // For now, we just ensure it's marked as not new.
  };

  const handleDelete = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateCaption = (id, newCaption) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: newCaption } : p));
  };

  const handleRegenerateCaption = async (id) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: 'photo.regenerating' } : p));
    try {
      const caption = await generateCaption(photo.imageSrc, language);
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption } : p));
    } catch (error) {
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: 'photo.error_regenerate' } : p));
    }
  };

  const handleDownloadWall = async () => {
    const element = document.getElementById('app-root');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        ignoreElements: (element) => {
          if (element.classList.contains('photo-actions')) return true;
          return false;
        }
      });

      const link = document.createElement('a');
      link.download = `bao-retro-wall-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download Wall Error", err);
    }
  };

  return (
    <div id="app-root" className="relative w-screen h-screen overflow-hidden bg-stone-100 selection:bg-orange-200">
      <div data-html2canvas-ignore="true">
        <LanguageSwitcher />
      </div>

      {/* Title */}
      <h1 className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl md:text-6xl font-bold text-stone-800 tracking-wider z-10 pointer-events-none font-['Patrick_Hand'] whitespace-nowrap">
        {t('app.title')}
      </h1>

      {/* Instructions */}
      <div data-html2canvas-ignore="true" className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center text-stone-500 text-sm md:hidden z-10 pointer-events-none font-['Patrick_Hand']">
        {t('instructions.step2')}
      </div>
      <div data-html2canvas-ignore="true" className="hidden md:block absolute bottom-8 right-8 text-right text-stone-600 z-10 pointer-events-none max-w-xs font-['Patrick_Hand']">
        <h3 className="text-xl font-bold mb-2">{t('instructions.title')}</h3>
        <ul className="list-disc list-inside space-y-1 text-lg">
          <li>{t('instructions.step1')}</li>
          <li>{t('instructions.step2')}</li>
          <li>{t('instructions.step3')}</li>
          <li>{t('instructions.step4')}</li>
          <li>{t('instructions.step5')}</li>
        </ul>
      </div>

      {/* Main Camera Component */}
      <div data-html2canvas-ignore="true">
        <RetroCamera onPhotoTaken={handlePhotoTaken} />
      </div>

      {/* Download Wall Button */}
      <button
        data-html2canvas-ignore="true"
        onClick={handleDownloadWall}
        className="absolute top-8 left-8 z-50 bg-stone-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-stone-700 transition-colors flex items-center gap-2 font-['Patrick_Hand']"
      >
        <Download size={18} />
        <span className="hidden md:inline">{t('action.download_wall')}</span>
      </button>

      {/* Photos Layer (Single container for all photos) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {photos.map(photo => (
          <div key={photo.id} className="pointer-events-auto">
            <PhotoCard
              {...photo}
              style={{
                // Mobile: Camera 300x300, centered bottom.
                // Desktop: Camera 450x450, bottom-left 64px.
                left: window.innerWidth < 768 ? '50%' : '289px',
                bottom: window.innerWidth < 768 ? '320px' : '514px',
                x: '-50%', // Center horizontally relative to the left point
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDelete={handleDelete}
              onUpdateCaption={handleUpdateCaption}
              onRegenerateCaption={handleRegenerateCaption}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
