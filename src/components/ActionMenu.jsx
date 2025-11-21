import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Layout, Eye, EyeOff, Smartphone, Palette } from 'lucide-react';
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

const ActionMenu = ({
    onDownload,
    onShuffle,
    onToggleCamera,
    isCameraVisible,
    onConnectPhone,
    currentBg,
    onSelectBg
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBgPicker, setShowBgPicker] = useState(false);
    const { t } = useLanguage();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (isOpen) setShowBgPicker(false); // Reset sub-menu on close
    };

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };

    return (
        <div className="absolute top-8 left-8 z-50 flex flex-col gap-4" data-html2canvas-ignore="true">
            <button
                onClick={toggleMenu}
                className="bg-stone-800 text-white w-12 h-12 rounded-full shadow-lg hover:bg-stone-700 transition-colors flex items-center justify-center"
                title={isOpen ? "Close Menu" : "Open Menu"}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        className="flex flex-col gap-3 items-start"
                    >
                        <motion.button
                            variants={itemVariants}
                            onClick={() => { onDownload(); toggleMenu(); }}
                            className="bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-2 font-['Patrick_Hand'] whitespace-nowrap"
                            title={t('action.download_wall')}
                        >
                            <Download size={18} />
                            <span className="hidden md:inline">{t('action.download_wall')}</span>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => { onShuffle(); toggleMenu(); }}
                            className="bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-2 font-['Patrick_Hand'] whitespace-nowrap"
                            title={t('action.shuffle')}
                        >
                            <Layout size={18} />
                            <span className="hidden md:inline">{t('action.shuffle')}</span>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => { onToggleCamera(); toggleMenu(); }}
                            className="bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-2 font-['Patrick_Hand'] whitespace-nowrap"
                            title={isCameraVisible ? t('action.hide_camera') : t('action.show_camera')}
                        >
                            {isCameraVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span className="hidden md:inline">{isCameraVisible ? t('action.hide_camera') : t('action.show_camera')}</span>
                        </motion.button>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => { onConnectPhone(); toggleMenu(); }}
                            className="hidden md:flex bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors items-center gap-2 font-['Patrick_Hand'] whitespace-nowrap"
                            title={t('action.connect_phone')}
                        >
                            <Smartphone size={18} />
                            <span className="hidden md:inline">{t('action.connect_phone')}</span>
                        </motion.button>

                        {/* Background Selector Toggle */}
                        <motion.div variants={itemVariants} className="flex flex-col gap-2">
                            <button
                                onClick={() => setShowBgPicker(!showBgPicker)}
                                className={`bg-white text-stone-800 px-4 py-2 rounded-full shadow-lg hover:bg-stone-100 transition-colors flex items-center gap-2 font-['Patrick_Hand'] whitespace-nowrap ${showBgPicker ? 'bg-stone-100 ring-2 ring-stone-200' : ''}`}
                                title="Change Background"
                            >
                                <Palette size={18} />
                                <span className="hidden md:inline">{t('action.background')}</span>
                            </button>

                            {/* Background Grid */}
                            <AnimatePresence>
                                {showBgPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-white p-3 rounded-xl shadow-xl grid grid-cols-3 gap-2 w-[180px]"
                                    >
                                        {backgrounds.map((bg) => (
                                            <button
                                                key={bg.id}
                                                onClick={() => {
                                                    onSelectBg(bg.class);
                                                    // toggleMenu(); // Optional: close menu on select
                                                }}
                                                className={`w-10 h-10 rounded-lg border-2 shadow-sm transition-all hover:scale-105 relative overflow-hidden ${currentBg === bg.class ? 'border-stone-800 ring-2 ring-stone-200' : 'border-stone-200'} ${bg.class === 'bg-pattern-grid' ? 'bg-stone-100' : bg.class}`}
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActionMenu;
