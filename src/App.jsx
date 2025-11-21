import React, { useState } from 'react';
import RetroCamera from './components/RetroCamera';
import PhotoCard from './components/PhotoCard';
import { generateCaption } from './services/ai';
import { Download, Layout, Eye, EyeOff } from 'lucide-react';
import html2canvas from 'html2canvas';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import BackgroundSelector from './components/BackgroundSelector';

function AppContent() {
  const [photos, setPhotos] = useState([]);
  const [currentBg, setCurrentBg] = useState('bg-stone-100');
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const { t, language } = useLanguage();

  const handlePhotoTaken = async (imageSrc) => {
    const newPhoto = {
      id: Date.now(),
      imageSrc,
      date: new Date().toLocaleDateString(),
      caption: 'photo.developing', // Store key, translate in component
      isNew: true,
      // Initial position (ejection point)
      style: {
        left: window.innerWidth < 768 ? '50%' : '239px',
        bottom: window.innerWidth < 768 ? '320px' : '414px',
        x: '-50%',
        rotate: 0,
      }
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

  const handleRandomLayout = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    // Card dimensions
    const cardWidth = isMobile ? 260 : 300;
    const cardHeight = cardWidth * 1.33 + 32; // Aspect ratio 4:3 + padding approx

    // Safe margins
    const safeMargin = 20;
    const topOffset = 120; // Title and buttons area

    setPhotos(prev => prev.map(photo => {
      // Rotation range
      const maxRot = isMobile ? 10 : 15;
      const randomRotate = Math.random() * (maxRot * 2) - maxRot;

      // Calculate bounding box size after rotation (radians)
      const rad = Math.abs(randomRotate * Math.PI / 180);
      const boundingW = cardWidth * Math.cos(rad) + cardHeight * Math.sin(rad);
      const boundingH = cardWidth * Math.sin(rad) + cardHeight * Math.cos(rad);

      // Calculate safe center range
      // Center must be at least half bounding box away from edges + margin
      const minCenterX = boundingW / 2 + safeMargin;
      const maxCenterX = width - boundingW / 2 - safeMargin;

      const minCenterY = topOffset + boundingH / 2;
      const maxCenterY = height - boundingH / 2 - safeMargin;

      // Ensure valid ranges
      const rangeX = Math.max(0, maxCenterX - minCenterX);
      const rangeY = Math.max(0, maxCenterY - minCenterY);

      const randomCenterX = Math.random() * rangeX + minCenterX;
      const randomCenterY = Math.random() * rangeY + minCenterY;

      // Convert center to top-left for positioning
      // Since we changed origin to center, we can position the center?
      // No, absolute positioning is still top-left based.
      // But transform origin is center.
      // So if we set left/top, that's the top-left corner of the unrotated element.
      // The rotation happens around the center of that box.
      // So we just need to place the unrotated box such that its center is at randomCenter.
      const left = randomCenterX - cardWidth / 2;
      const top = randomCenterY - cardHeight / 2;

      return {
        ...photo,
        isNew: false,
        style: {
          left: `${left}px`,
          top: `${top}px`,
          bottom: 'auto',
          x: 0,
          y: 0,
          rotate: randomRotate
        }
      };
    }));
  };

  return (
    <div id="app-root" className={`relative w-screen h-screen overflow-hidden transition-colors duration-500 ${currentBg} selection:bg-orange-200`}>
      <div data-html2canvas-ignore="true">
        <LanguageSwitcher />
        <BackgroundSelector currentBg={currentBg} onSelect={setCurrentBg} />
      </div>

      {/* Title */}
      <h1 className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl md:text-6xl font-bold text-stone-800 tracking-wider z-10 pointer-events-none font-['Patrick_Hand'] whitespace-nowrap mix-blend-multiply opacity-80">
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
      <div data-html2canvas-ignore="true" className={`transition-opacity duration-300 ${isCameraVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <RetroCamera onPhotoTaken={handlePhotoTaken} />
      </div>

      {/* Action Buttons */}
      <div className="absolute top-8 left-8 z-50 flex flex-col gap-4" data-html2canvas-ignore="true">
        <button
          onClick={handleDownloadWall}
          className="bg-stone-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-stone-700 transition-colors flex items-center gap-2 font-['Patrick_Hand']"
          title={t('action.download_wall')}
        >
          <Download size={18} />
          <span className="hidden md:inline">{t('action.download_wall')}</span>
        </button>

        <button
          onClick={handleRandomLayout}
          className="bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-2 font-['Patrick_Hand']"
          title={t('action.shuffle')}
        >
          <Layout size={18} />
          <span className="hidden md:inline">{t('action.shuffle')}</span>
        </button>

        <button
          onClick={() => setIsCameraVisible(!isCameraVisible)}
          className="bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-2 font-['Patrick_Hand']"
          title={isCameraVisible ? t('action.hide_camera') : t('action.show_camera')}
        >
          {isCameraVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          <span className="hidden md:inline">{isCameraVisible ? t('action.hide_camera') : t('action.show_camera')}</span>
        </button>
      </div>

      {/* Photos Layer (Single container for all photos) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {photos.map(photo => (
          <div key={photo.id} className="pointer-events-auto">
            <PhotoCard
              {...photo}
              // Use the style from the photo object if available, otherwise default (for backward compatibility or initial state)
              style={photo.style || {
                left: window.innerWidth < 768 ? '50%' : '239px',
                bottom: window.innerWidth < 768 ? '320px' : '414px',
                x: '-50%',
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
