import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Download, Trash2, Pencil, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useLanguage } from '../contexts/LanguageContext';

const PhotoCard = ({
    id,
    imageSrc,
    date,
    caption,
    isNew,
    style,
    onDragStart,
    onDragEnd,
    onDelete,
    onUpdateCaption,
    onRegenerateCaption
}) => {
    const [isDeveloping, setIsDeveloping] = useState(isNew);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCaption, setEditedCaption] = useState(caption);
    const controls = useAnimation();
    const { t } = useLanguage();

    useEffect(() => {
        if (isNew) {
            // Ejection animation
            controls.start({
                y: '-12%',
                transition: { duration: 1, ease: "easeOut" }
            });

            // Developing effect
            const timer = setTimeout(() => {
                setIsDeveloping(false);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            controls.set({ y: 0 });
        }
    }, [isNew, controls]);

    useEffect(() => {
        setEditedCaption(caption);
    }, [caption]);

    const handleDownload = async () => {
        const element = document.getElementById(`photo-card-${id}`);
        if (element) {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
            const link = document.createElement('a');
            link.download = `bao-retro-${id}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const handleSaveEdit = () => {
        onUpdateCaption(id, editedCaption);
        setIsEditing(false);
    };

    return (
        <motion.div
            id={`photo-card-${id}`}
            className={`absolute w-[260px] md:w-[300px] origin-top-left select-none touch-none ${isNew ? 'z-10' : 'z-40'}`}
            style={style}
            animate={controls}
            drag
            dragMomentum={false}
            onDragStart={() => {
                if (onDragStart) onDragStart(id);
            }}
            onDragEnd={(e, info) => {
                if (onDragEnd) onDragEnd(id, info.point);
            }}
        >
            {/* Polaroid Frame */}
            <div className="relative w-full pt-[133%] bg-white shadow-xl p-4 flex flex-col items-center transform hover:scale-105 transition-transform duration-200 cursor-grab active:cursor-grabbing">

                {/* Inner Content Wrapper to handle aspect ratio absolute positioning */}
                <div className="absolute inset-0 p-3 flex flex-col">

                    {/* Photo Area */}
                    <div className="relative w-full h-[75%] bg-black overflow-hidden mb-2">
                        <img
                            src={imageSrc}
                            alt="Memory"
                            className={`w-full h-full object-cover transition-all duration-[1500ms] ${isDeveloping ? 'blur-md grayscale opacity-80' : 'blur-0 grayscale-0 opacity-100'}`}
                        />
                    </div>

                    {/* Text Area */}
                    <div className="flex-1 flex flex-col justify-between w-full">
                        <div className="text-xs text-stone-400 text-right font-sans">{date}</div>

                        <div className="relative group flex-1 flex items-center justify-center text-center">
                            {isEditing ? (
                                <textarea
                                    className="w-full h-full bg-transparent border-b border-stone-300 focus:outline-none resize-none text-center font-['Patrick_Hand'] text-lg leading-tight"
                                    value={t(editedCaption)} // Show translated value in edit mode too? No, usually raw. But here it might be a key.
                                    // Actually, if it's a key, we probably want to edit the translated text.
                                    // But if we save, we save the translated text. That's fine.
                                    // Wait, if I edit "Developing..." (translated) to "My Photo", it saves "My Photo".
                                    // If I don't edit, it stays "photo.developing".
                                    // So value should be t(editedCaption).
                                    // But onChange sets editedCaption.
                                    // If I type "A", editedCaption becomes "A". t("A") is "A".
                                    // If I start with "photo.developing", t("photo.developing") is "Developing...".
                                    // If I edit, I want to edit "Developing...".
                                    // So I should initialize editedCaption with t(caption) in useEffect?
                                    // Yes, let's do that.
                                    onChange={(e) => setEditedCaption(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit();
                                        if (e.key === 'Escape') setIsEditing(false);
                                    }}
                                    autoFocus
                                    onBlur={handleSaveEdit}
                                />
                            ) : (
                                <p
                                    className="font-['Patrick_Hand'] text-lg leading-tight text-stone-800 w-full break-words"
                                    onDoubleClick={() => setIsEditing(true)}
                                >
                                    {t(caption) || "..."}
                                </p>
                            )}

                            {/* Hover Controls for Text */}
                            {!isEditing && !isDeveloping && (
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500" title={t('action.edit')}>
                                        <Pencil size={12} />
                                    </button>
                                    <button onClick={() => onRegenerateCaption(id)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500" title={t('action.regenerate')}>
                                        <RefreshCw size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Hover Controls (Download/Delete) */}
                    {!isNew && (
                        <div className="photo-actions absolute -top-8 left-0 w-full flex justify-center gap-2 opacity-100 transition-opacity bg-white/80 py-1 rounded-t-lg">
                            <button onClick={handleDownload} className="p-1 hover:text-blue-600" title={t('action.download')}>
                                <Download size={16} />
                            </button>
                            <button onClick={() => onDelete(id)} className="p-1 hover:text-red-600" title={t('action.delete')}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default PhotoCard;
