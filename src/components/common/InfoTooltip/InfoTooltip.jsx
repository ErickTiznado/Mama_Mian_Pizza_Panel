import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, TrendingUp, Lightbulb, BarChart3, Bookmark, BookmarkCheck, Copy, CheckCircle } from 'lucide-react';
import './InfoTooltip.css';

const InfoTooltip = ({ 
    title, 
    content, 
    businessImpact, 
    actionTips, 
    position = 'top',
    size = 'medium',
    variant = 'default', // 'default', 'compact', 'detailed'
    showBookmark = false, // Nueva prop para mostrar opción de bookmark
    bookmarkKey = null // Clave única para el bookmark
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [copyStatus, setCopyStatus] = useState(null);
    const tooltipRef = useRef(null);
    const triggerRef = useRef(null);

    // Load bookmark status from localStorage
    useEffect(() => {
        if (showBookmark && bookmarkKey) {
            const bookmarks = JSON.parse(localStorage.getItem('tooltipBookmarks') || '{}');
            setIsBookmarked(!!bookmarks[bookmarkKey]);
        }
    }, [showBookmark, bookmarkKey]);

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target) && 
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                closeTooltip();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isVisible) {
                closeTooltip();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isVisible]);    const openTooltip = () => {
        setIsVisible(true);
    };

    const closeTooltip = () => {
        setIsVisible(false);
    };

    const toggleTooltip = () => {
        if (isVisible) {
            closeTooltip();
        } else {
            openTooltip();
        }
    };

    const toggleBookmark = () => {
        if (!showBookmark || !bookmarkKey) return;
        
        const bookmarks = JSON.parse(localStorage.getItem('tooltipBookmarks') || '{}');
        
        if (isBookmarked) {
            delete bookmarks[bookmarkKey];
        } else {
            bookmarks[bookmarkKey] = {
                title,
                content,
                businessImpact,
                actionTips,
                timestamp: Date.now()
            };
        }
        
        localStorage.setItem('tooltipBookmarks', JSON.stringify(bookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const copyToClipboard = async () => {
        const textToCopy = `
📊 ${title}

¿Qué significa?
${content}

💼 Impacto en tu negocio
${businessImpact}

💡 Acciones recomendadas
${actionTips}
        `.trim();

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopyStatus('success');
            setTimeout(() => setCopyStatus(null), 2000);
        } catch (err) {
            setCopyStatus('error');
            setTimeout(() => setCopyStatus(null), 2000);
        }
    };

    return (
        <div className="info-tooltip-container">            <button
                ref={triggerRef}
                className={`info-tooltip-trigger ${size} ${variant} ${isVisible ? 'active' : ''}`}
                onMouseEnter={() => {}} // Hover deshabilitado
                onMouseLeave={() => {}} // Hover deshabilitado
                onClick={toggleTooltip}
                aria-label={`Información sobre ${title}`}
                aria-expanded={isVisible}
                style={{
                    transition: 'none',
                    transform: 'none'
                }}
            >
                <HelpCircle size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />
                {variant === 'detailed' && (
                    <span className="trigger-pulse"></span>
                )}
            </button>            {isVisible && (
                <div 
                    ref={tooltipRef}
                    className={`info-tooltip-popup ${position} ${variant}`}
                    onMouseEnter={() => {}} // Hover deshabilitado
                    onMouseLeave={() => {}} // Hover deshabilitado
                    style={{
                        transition: 'none',
                        transform: 'none',
                        animation: 'none'
                    }}
                >
                    <div className="tooltip-header">
                        <div className="header-content">
                            <BarChart3 size={18} className="header-icon" />
                            <h4>{title}</h4>
                        </div>
                        <button 
                            className="close-button"
                            onClick={closeTooltip}
                            aria-label="Cerrar tooltip"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    
                    <div className="tooltip-content">
                        <div className="tooltip-section primary">
                            <div className="section-header">
                                <BarChart3 size={16} />
                                <h5>¿Qué significa?</h5>
                            </div>
                            <p>{content}</p>
                        </div>
                        
                        {businessImpact && (
                            <div className="tooltip-section business">
                                <div className="section-header">
                                    <TrendingUp size={16} />
                                    <h5>Impacto en tu negocio</h5>
                                </div>
                                <p>{businessImpact}</p>
                            </div>
                        )}
                        
                        {actionTips && (
                            <div className="tooltip-section actions">
                                <div className="section-header">
                                    <Lightbulb size={16} />
                                    <h5>Acciones recomendadas</h5>
                                </div>
                                <div className="action-tips">
                                    {actionTips.split('•').filter(tip => tip.trim()).map((tip, index) => (
                                        <div key={index} className="action-tip">
                                            <span className="tip-bullet">•</span>
                                            <span className="tip-text">{tip.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                      {variant === 'detailed' && (
                        <div className="tooltip-footer">
                            <span className="footer-text">💡 Tip: Haz clic fuera o presiona ESC para cerrar</span>
                        </div>
                    )}

                    {showBookmark && (
                        <div className="tooltip-actions">
                            <button 
                                className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
                                onClick={toggleBookmark}
                                aria-label={isBookmarked ? 'Eliminar bookmark' : 'Guardar como bookmark'}
                            >
                                {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                <span className="button-text">
                                    {isBookmarked ? 'Guardado' : 'Guardar'}
                                </span>
                            </button>

                            <button 
                                className="copy-button"
                                onClick={copyToClipboard}
                                aria-label="Copiar información"
                            >
                                {copyStatus === 'success' ? <CheckCircle size={16} className="copy-icon success" /> : 
                                 copyStatus === 'error' ? <X size={16} className="copy-icon error" /> :
                                 <Copy size={16} />}
                                <span className="button-text">
                                    {copyStatus === 'success' ? 'Copiado' : copyStatus === 'error' ? 'Error' : 'Copiar'}
                                </span>
                            </button>
                        </div>
                    )}

                    {showBookmark && (
                        <div className="tooltip-bookmark">
                            <button 
                                className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
                                onClick={toggleBookmark}
                                aria-label={isBookmarked ? 'Eliminar bookmark' : 'Guardar como bookmark'}
                            >
                                {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                <span className="button-text">
                                    {isBookmarked ? 'Guardado' : 'Guardar'}
                                </span>
                            </button>
                        </div>
                    )}

                    <div className="tooltip-actions">
                        <button 
                            className="copy-button"
                            onClick={copyToClipboard}
                            aria-label="Copiar información"
                        >
                            {copyStatus === 'success' && <CheckCircle size={16} className="copy-icon success" />}
                            {copyStatus === 'error' && <X size={16} className="copy-icon error" />}
                            <span className="button-text">
                                {copyStatus === 'success' ? 'Copiado' : copyStatus === 'error' ? 'Error' : 'Copiar'}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;
