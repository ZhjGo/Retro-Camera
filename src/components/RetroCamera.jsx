import React from 'react';
import { useCamera } from '../hooks/useCamera';
import { useLanguage } from '../contexts/LanguageContext';
import { RefreshCcw } from 'lucide-react';
import backCameraImage from '../assets/against-retro-camera.png';

const RetroCamera = ({ onPhotoTaken }) => {
    const { videoRef, takePhoto, toggleCamera, facingMode, stream } = useCamera();
    const { t } = useLanguage();
    const [isFlipped, setIsFlipped] = React.useState(false);
    const backVideoRef = React.useRef(null);

    React.useEffect(() => {
        if (stream && backVideoRef.current) {
            backVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleShutter = () => {
        // Use the correct video element based on flip state
        const activeVideo = isFlipped ? backVideoRef.current : videoRef.current;
        const photo = takePhoto(activeVideo);

        if (photo) {
            // Play sound (placeholder)
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'); // Camera shutter sound
            audio.play().catch(e => console.log('Audio play failed', e));

            onPhotoTaken(photo);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        // Delay camera toggle slightly to match animation or just toggle immediately
        toggleCamera();
    };

    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:bottom-[64px] md:left-[64px] md:translate-x-0 md:w-[350px] md:h-[350px] z-20 pointer-events-none perspective-[1000px]"
        >
            {/* Outside Flip Button */}
            <div
                className="absolute -right-12 md:-right-16 z-50 cursor-pointer bg-stone-800 text-white rounded-full p-3 shadow-lg hover:bg-stone-700 transition-all pointer-events-auto flex items-center justify-center"
                style={{ top: '10%' }}
                onClick={handleFlip}
                title="Switch Camera"
            >
                <RefreshCcw size={24} />
            </div>

            <div
                className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* Front Side (User Facing / Selfie) */}
                <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <img
                        src="https://s.baoyu.io/images/retro-camera.webp"
                        alt="Retro Camera Front"
                        className="w-full h-full object-contain select-none"
                    />
                    {/* Viewfinder (Front) */}
                    <div
                        className="absolute bg-black overflow-hidden"
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
                            className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
                        />
                    </div>
                    {/* Shutter Button (Front) */}
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

                {/* Back Side (World Facing) */}
                <div
                    className="absolute inset-0 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <img
                        src={backCameraImage}
                        alt="Retro Camera Back"
                        className="w-full h-full object-contain select-none"
                    />

                    {/* Viewfinder (Back) - Pixel Perfect */}
                    <div
                        className="absolute bg-black overflow-hidden border-4 border-stone-800/50"
                        style={{
                            top: '42.97%', // 440 / 1024
                            left: '32.42%', // 332 / 1024
                            width: '32.32%', // 331 / 1024
                            height: '16.01%', // 164 / 1024
                            borderRadius: '4px'
                        }}
                    >
                        <video
                            ref={backVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
                        />
                    </div>

                    {/* Shutter Button (Back) - Pixel Perfect */}
                    <div
                        className="absolute z-30 cursor-pointer hover:bg-white/10 rounded-full transition-colors pointer-events-auto border-2 border-white/20"
                        style={{
                            top: '14.65%', // 150 / 1024
                            left: '67%', // 686 / 1024
                            width: '12%', // Keep size consistent
                            height: '12%'
                        }}
                        onClick={handleShutter}
                        title={t('action.take_photo')}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default RetroCamera;
