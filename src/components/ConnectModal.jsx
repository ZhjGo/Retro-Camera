import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ConnectModal = ({ isOpen, onClose, peerId }) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const connectUrl = `${window.location.origin}?connectTo=${peerId}`;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative transform transition-all scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-600">
                        <Smartphone size={24} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-stone-800 mb-1">{t('connect.title')}</h3>
                        <p className="text-stone-500 text-sm">{t('connect.subtitle')}</p>
                    </div>

                    <div className="bg-white p-2 rounded-xl border-2 border-stone-100 shadow-inner">
                        {peerId ? (
                            <QRCodeSVG value={connectUrl} size={200} level="H" />
                        ) : (
                            <div className="w-[200px] h-[200px] flex items-center justify-center text-stone-300">
                                Loading...
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-stone-400 max-w-[200px]">
                        {t('connect.instruction')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;
