import React from 'react';
import { useCamera } from '../hooks/useCamera';
import { useLanguage } from '../contexts/LanguageContext';

const RetroCamera = ({ onPhotoTaken }) => {
    const { videoRef, takePhoto } = useCamera();
    const { t } = useLanguage();

    const handleShutter = () => {
        const photo = takePhoto();
        if (photo) {
            // Play sound (placeholder)
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'); // Camera shutter sound
            audio.play().catch(e => console.log('Audio play failed', e));

            onPhotoTaken(photo);
        }
    };

    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:bottom-[64px] md:left-[64px] md:translate-x-0 md:w-[450px] md:h-[450px] z-20 pointer-events-none"
        >
            {/* Camera Body Image */}
            <img
                src="https://s.baoyu.io/images/retro-camera.webp"
                alt="Retro Camera"
                className="absolute bottom-0 left-0 w-full h-full object-contain z-20 pointer-events-none select-none"
            />

            {/* Viewfinder */}
            <div
                className="absolute bg-black z-30 overflow-hidden"
                style={{
                    bottom: '32%',
                    left: '62%',
                    transform: 'translateX(-50%)',
                    width: '27%',
                    height: '27%',
                    borderRadius: '50%'
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100" // Mirror the video
                />
            </div>

            {/* Shutter Button */}
            <div
                className="absolute z-30 cursor-pointer hover:bg-white/10 rounded-full transition-colors pointer-events-auto"
                style={{
                    bottom: '40%',
                    left: '18%',
                    width: '11%',
                    height: '11%'
                }}
                onClick={handleShutter}
                title={t('action.take_photo')}
            ></div>
        </div>
    );
};

export default RetroCamera;
