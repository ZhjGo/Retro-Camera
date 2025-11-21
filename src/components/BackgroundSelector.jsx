import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const backgrounds = [
    { id: 'stone', name: 'Stone', class: 'bg-stone-100' },
    { id: 'grid', name: 'Grid', class: 'bg-pattern-grid' },
    { id: 'graph', name: 'Graph', class: 'bg-pattern-graph' },
    { id: 'cork', name: 'Cork', class: 'bg-pattern-cork' },
    { id: 'dots', name: 'Dots', class: 'bg-pattern-dots' },
    { id: 'linen', name: 'Linen', class: 'bg-pattern-linen' },
    { id: 'picnic', name: 'Picnic', class: 'bg-pattern-picnic' },
    { id: 'clouds', name: 'Clouds', class: 'bg-pattern-clouds' },
    { id: 'mint', name: 'Mint', class: 'bg-pattern-mint' },
];

const BackgroundSelector = ({ currentBg, onSelect }) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute top-20 right-8 z-50 flex flex-col items-end gap-2" data-html2canvas-ignore="true">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                title="Change Background"
            >
                {isOpen ? <X size={20} /> : <Palette size={20} />}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="bg-white p-3 rounded-xl shadow-xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider text-center">Background</div>
                    <div className="grid grid-cols-2 gap-2">
                        {backgrounds.map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => {
                                    onSelect(bg.class);
                                    // Optional: keep open or close? Let's keep open for exploration
                                }}
                                className={`w-12 h-12 rounded-lg border-2 shadow-sm transition-all hover:scale-105 relative overflow-hidden ${currentBg === bg.class ? 'border-stone-800 ring-2 ring-stone-200' : 'border-stone-200'
                                    } ${bg.class === 'bg-pattern-grid' ? 'bg-stone-100' : bg.class}`}
                                style={
                                    bg.id === 'grid' ? {
                                        backgroundImage: 'linear-gradient(#e7e5e4 1px, transparent 1px), linear-gradient(90deg, #e7e5e4 1px, transparent 1px)',
                                        backgroundSize: '10px 10px'
                                    } : bg.id === 'graph' ? {
                                        backgroundColor: '#f0f9ff',
                                        backgroundImage: 'linear-gradient(#bae6fd 1px, transparent 1px), linear-gradient(90deg, #bae6fd 1px, transparent 1px)',
                                        backgroundSize: '10px 10px'
                                    } : bg.id === 'cork' ? {
                                        backgroundColor: '#d4b483',
                                        backgroundImage: 'radial-gradient(#c19a6b 15%, transparent 16%), radial-gradient(#c19a6b 15%, transparent 16%)',
                                        backgroundSize: '6px 6px',
                                        backgroundPosition: '0 0, 3px 3px'
                                    } : bg.id === 'dots' ? {
                                        backgroundColor: '#f5f5f4',
                                        backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)',
                                        backgroundSize: '10px 10px'
                                    } : bg.id === 'linen' ? {
                                        backgroundColor: '#fafaf9',
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, #e7e5e4 1px, #e7e5e4 2px), repeating-linear-gradient(-45deg, transparent, transparent 1px, #e7e5e4 1px, #e7e5e4 2px)'
                                    } : bg.id === 'picnic' ? {
                                        backgroundColor: '#fff1f2',
                                        backgroundImage: 'linear-gradient(45deg, #fecdd3 25%, transparent 25%, transparent 75%, #fecdd3 75%, #fecdd3), linear-gradient(45deg, #fecdd3 25%, transparent 25%, transparent 75%, #fecdd3 75%, #fecdd3)',
                                        backgroundSize: '10px 10px',
                                        backgroundPosition: '0 0, 5px 5px'
                                    } : bg.id === 'clouds' ? {
                                        background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)'
                                    } : bg.id === 'mint' ? {
                                        backgroundColor: '#f0fdf4',
                                        backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, #dcfce7 5px, #dcfce7 10px)'
                                    } : {}
                                }
                                title={bg.name}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackgroundSelector;
