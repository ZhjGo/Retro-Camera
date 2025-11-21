import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { Camera, RefreshCw, Wifi, WifiOff, SwitchCamera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MobileRemote = () => {
    const { t } = useLanguage();
    const [peer, setPeer] = useState(null);
    const [conn, setConn] = useState(null);
    const [status, setStatus] = useState('connecting'); // connecting, connected, disconnected, error
    const [facingMode, setFacingMode] = useState('environment');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Get host ID from URL
    const getHostId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('connectTo');
    };

    useEffect(() => {
        const hostId = getHostId();
        if (!hostId) {
            setStatus('error');
            return;
        }

        const newPeer = new Peer();
        setPeer(newPeer);

        newPeer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            const connection = newPeer.connect(hostId);

            connection.on('open', () => {
                setStatus('connected');
                setConn(connection);
            });

            connection.on('close', () => {
                setStatus('disconnected');
                setConn(null);
            });

            connection.on('error', (err) => {
                console.error('Connection error:', err);
                setStatus('error');
            });

            setConn(connection);
        });

        newPeer.on('error', (err) => {
            console.error('Peer error:', err);
            setStatus('error');
        });

        return () => {
            newPeer.destroy();
        };
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    const startCamera = async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Explicitly play to avoid black screen on some devices
                try {
                    await videoRef.current.play();
                } catch (e) {
                    console.error("Play error:", e);
                }
            }
        } catch (err) {
            console.error("Camera Error", err);
            setStatus('error'); // Show error state if camera fails
        }
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const takePhoto = () => {
        if (!conn || status !== 'connected') return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Mirror if using front camera
            if (facingMode === 'user') {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageSrc = canvas.toDataURL('image/jpeg', 0.8);

            // Send to host
            conn.send({ type: 'photo', data: imageSrc });

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(50);
        }
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-between p-4 text-white">
            {/* Header / Status */}
            <div className="w-full flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                    {status === 'connected' ? <Wifi className="text-green-400" size={20} /> : <WifiOff className="text-red-400" size={20} />}
                    <span className="text-sm font-mono uppercase">{status}</span>
                </div>

                <button
                    onClick={toggleCamera}
                    className="p-2 rounded-full bg-stone-800/50 backdrop-blur-sm active:bg-stone-700 transition-colors"
                >
                    <SwitchCamera size={24} />
                </button>
            </div>

            {/* Viewfinder */}
            <div className="relative w-full aspect-[3/4] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="w-full flex justify-center items-center pb-8 pt-4">
                <button
                    onClick={takePhoto}
                    disabled={status !== 'connected'}
                    className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-95 ${status === 'connected' ? 'bg-red-500 hover:bg-red-600' : 'bg-stone-700 opacity-50 cursor-not-allowed'}`}
                >
                    <div className="w-16 h-16 rounded-full border-2 border-black/20"></div>
                </button>
            </div>
        </div>
    );
};

export default MobileRemote;
