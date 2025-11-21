import { useState, useEffect, useRef } from 'react';

export const useCamera = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'

    useEffect(() => {
        const startCamera = async () => {
            // Stop existing tracks if any
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError(err);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]); // Re-run when facingMode changes

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const takePhoto = (videoElement = videoRef.current) => {
        if (videoElement) {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');

            // Flip horizontally ONLY if using user-facing camera (mirror effect)
            if (facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(videoElement, 0, 0);
            return canvas.toDataURL('image/jpeg');
        }
        return null;
    };

    return { videoRef, takePhoto, error, toggleCamera, facingMode, stream };
};
