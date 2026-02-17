import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ScrollData } from '../types';
import { CelticBorder } from './CelticBorder';

interface ScrollPreviewProps {
  data: ScrollData;
  onEditField?: (field: string) => void;
}

const getOrdinalWord = (n: number): string => {
  const words = ['Zero', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
  return words[n] || `${n}th`;
};

export const ScrollPreview: React.FC<ScrollPreviewProps> = ({ data, onEditField }) => {
  const { 
    location,
    recipient, 
    awardType, 
    customAwardName,
    awardLevel,
    date, 
    giver, 
    reason, 
    theme, 
    backgroundImage,
    titleFont, 
    bodyFont, 
    recipientFont,
    signatureFont,
    heraldryImage, 
    heraldryPosition,
    heraldryScale,
    orientation,
    titleFontSize,
    recipientFontSize,
    bodyFontSize,
    signatureFontSize,
    border
  } = data;

  const isLandscape = orientation === 'landscape';

  // Refs for layout measurement
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  // Scaling state
  const [scales, setScales] = useState({ reason: 1, title: 1, recipient: 1 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions for border generation
  useEffect(() => {
    if (scrollContentRef.current) {
        setDimensions({
            width: scrollContentRef.current.clientWidth,
            height: scrollContentRef.current.clientHeight
        });
    }
  }, [orientation, border.size, border.thickness, border.inset]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (scrollContentRef.current) {
            setDimensions({
                width: scrollContentRef.current.clientWidth,
                height: scrollContentRef.current.clientHeight
            });
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Stability: Reset scales ONLY when structural properties change (Font, Size, Orientation, Type)
  // This prevents the scale from snapping back to 1.0 and re-shrinking on every character typed.
  useEffect(() => {
    setScales({ reason: 1, title: 1, recipient: 1 });
  }, [
    awardType, titleFont, bodyFont, recipientFont, 
    orientation, titleFontSize, recipientFontSize, bodyFontSize, signatureFontSize
  ]);

  // Auto-scaling logic - runs synchronously before paint to prevent visible resizing jumps
  useLayoutEffect(() => {
    const checkOverflow = () => {
      if (!bodyRef.current || !scrollContentRef.current) return;
      
      const bodyEl = bodyRef.current;
      // 4px tolerance allows for subpixel rendering differences across browsers
      const hasOverflow = bodyEl.scrollHeight > bodyEl.clientHeight + 4;

      if (hasOverflow) {
        setScales(prev => {
          if (prev.reason > 0.6) {
            return { ...prev, reason: prev.reason * 0.97 }; // Steady shrink
          }
          if (prev.title > 0.6) {
            return { ...prev, title: prev.title * 0.97 };
          }
          if (prev.recipient > 0.6) {
             return { ...prev, recipient: prev.recipient * 0.97 };
          }
          return prev;
        });
      }
    };

    const timeout = setTimeout(checkOverflow, 10);
    return () => clearTimeout(timeout);
  }, [scales, reason, recipient, location, customAwardName, awardLevel]);

  const handleEdit = (field: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditField) {
      onEditField(field);
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditField) {
      if (awardType === 'Custom Award') {
        onEditField('customAwardName');
      } else {
        onEditField('awardType');
      }
    }
  };

  const editableClass = onEditField ? "cursor-pointer hover:bg-black/5 hover:ring-2 hover:ring-black/10 rounded px-2 -mx-2 transition-all relative group" : "";
  const editableHint = (
    <span className="hidden group-hover:block absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded whitespace-nowrap opacity-60 pointer-events-none font-sans tracking-wide z-50">
      Click to edit
    </span>
  );

  const containerStyle: React.CSSProperties = {
    fontFamily: bodyFont,
  };

  const borderClass = border.enabled ? '' : `border-[12px] double ${theme.borderColor}`;
  const displayName = awardType === 'Custom Award' ? customAwardName : awardType;
  const aspectRatioClass = isLandscape ? 'aspect-[1.29/1]' : 'aspect-[1/1.29]';
  const basePadding = isLandscape ? 32 : 48; 
  const borderPadding = border.enabled ? (border.thickness * border.size) + border.inset + 10 : 0;
  const paddingStyle = { padding: `${Math.max(basePadding, borderPadding)}px` };
  const fontScale = isLandscape ? 0.85 : 1.0;

  const tSize = Math.max(12, titleFontSize * fontScale * scales.title);
  const rSize = Math.max(12, recipientFontSize * fontScale * scales.recipient);
  const bSize = Math.max(10, bodyFontSize * fontScale * scales.reason);
  const sSize = Math.max(10, signatureFontSize * fontScale);

  const renderHeraldry = () => {
    if (!heraldryImage) return null;
    
    // Signature positions are handled inline in the footer grid
    if (heraldryPosition === 'signature-left' || heraldryPosition === 'signature-right') return null;

    let positionStyles: React.CSSProperties = {};
    const baseW = isLandscape ? 80 : 96; 
    const baseH = isLandscape ? 80 : 96;

    switch (heraldryPosition) {
      case 'top-left':
        positionStyles = {
          position: 'absolute',
          top: isLandscape ? '2rem' : '3rem',
          left: isLandscape ? '2rem' : '3rem',
          width: `${baseW * heraldryScale}px`,
          height: `${baseH * heraldryScale}px`,
          opacity: 0.9,
          zIndex: 10,
        };
        break;
      case 'top-right':
        positionStyles = {
          position: 'absolute',
          top: isLandscape ? '2rem' : '3rem',
          right: isLandscape ? '2rem' : '3rem',
          width: `${baseW * heraldryScale}px`,
          height: `${baseH * heraldryScale}px`,
          opacity: 0.9,
          zIndex: 10,
        };
        break;
      case 'bottom-center':
        const bottomBase = isLandscape ? 96 : 128;
        positionStyles = {
          position: 'absolute',
          bottom: isLandscape ? '2rem' : '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${bottomBase * heraldryScale}px`,
          height: `${bottomBase * heraldryScale}px`,
          opacity: 0.9,
          zIndex: 10,
        };
        break;
      case 'watermark':
        positionStyles = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${75 * heraldryScale}%`,
          height: `${75 * heraldryScale}%`,
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0,
          mixBlendMode: 'multiply',
        };
        break;
    }

    return <img src={heraldryImage} alt="Sigil" style={positionStyles} className="object-contain" />;
  };

  const isSignatureLayoutMod = heraldryImage && (heraldryPosition === 'signature-left' || heraldryPosition === 'signature-right');

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-stone-800/50 backdrop-blur-sm overflow-hidden">
      <div 
        ref={scrollContentRef}
        id="scroll-content"
        className={`print-area relative bg-gradient-to-br ${theme.bgGradient} shadow-2xl ${borderClass} ${aspectRatioClass} h-[95vh] w-auto max-w-[95vw] flex flex-col items-center text-center select-none overflow-hidden`}
        style={{...containerStyle, ...paddingStyle}}
      >
        {backgroundImage && (
           <div className="absolute inset-0 pointer-events-none z-0">
             <img src={backgroundImage} alt="Background" className="w-full h-full object-cover opacity-100" />
           </div>
        )}

        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${theme.textureOpacity}'/%3E%3C/svg%3E")`,
            opacity: 0.6
          }}
        />

        {border.enabled && dimensions.width > 0 && (
          <CelticBorder 
            width={dimensions.width}
            height={dimensions.height}
            size={border.size}
            thickness={border.thickness}
            inset={border.inset}
            color={border.color}
            strokeWidth={border.strokeWidth}
            innerColor={border.innerColor}
            pattern={border.pattern}
            cornerStyle={border.cornerStyle}
            heraldryPosition={heraldryPosition}
            heraldryScale={heraldryScale}
            hasHeraldry={!!heraldryImage}
          />
        )}

        {renderHeraldry()}

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          <div className="flex-shrink-0 w-full space-y-2 pb-2">
            <div className={`text-xl uppercase tracking-[0.2em] ${theme.accentColor} opacity-70`}>
              <div 
                className={`${editableClass} inline-block`}
                onClick={(e) => handleEdit('location', e)}
              >
                {editableHint}
                In the Lands of {location}
              </div>
            </div>
          </div>

          <div 
            ref={bodyRef}
            className="flex-grow flex flex-col justify-center items-center w-full min-h-0 overflow-hidden"
          >
             <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full h-full">
                <div className={`flex-shrink-0 ${theme.accentColor}`} style={{ fontSize: `${bSize * 1.1}px` }}>
                  Let it be known by these words that
                </div>
                
                <div className="flex-shrink-0 px-8">
                  <div 
                    className={`${editableClass} inline-block border-b-2 ${theme.borderColor.replace('border-', 'border-b-')} pb-2 leading-none`}
                    onClick={(e) => handleEdit('recipient', e)}
                    style={{ fontFamily: recipientFont, color: '#1c1917', fontSize: `${rSize}px` }}
                  >
                    {editableHint}
                    <span className="font-bold">
                      {recipient}
                    </span>
                  </div>
                </div>

                <div className={`flex-shrink-0 uppercase tracking-widest ${theme.accentColor} opacity-80 font-serif`} style={{ fontSize: `${bSize * 0.8}px` }}>
                  Has been granted the
                </div>

                <div className="flex flex-col items-center">
                  <div 
                    className={`${editableClass} inline-block leading-none`}
                    onClick={handleTitleClick}
                  >
                    {editableHint}
                    <h1 
                      className={`font-bold leading-tight ${theme.accentColor} drop-shadow-sm px-4`}
                      style={{ fontFamily: titleFont, fontSize: `${tSize}px` }}
                    >
                      {displayName}
                    </h1>
                  </div>
                  
                  {awardLevel > 0 && (
                    <div 
                       className={`${editableClass} mt-2 inline-block`}
                       onClick={(e) => handleEdit('awardLevel', e)}
                    >
                      <h2 className={`uppercase tracking-widest ${theme.accentColor} opacity-90 font-serif`} style={{ fontSize: `${tSize * 0.45}px` }}>
                        — {getOrdinalWord(awardLevel)} Order —
                      </h2>
                    </div>
                  )}
                </div>

                <div 
                  className={`${editableClass} leading-relaxed text-stone-800 italic px-8 whitespace-pre-wrap max-w-2xl`}
                  onClick={(e) => handleEdit('reason', e)}
                  style={{ fontSize: `${bSize}px` }}
                >
                  {editableHint}
                  "{reason}"
                </div>
             </div>
          </div>

          <div className={`flex-shrink-0 w-full grid ${isSignatureLayoutMod ? 'grid-cols-3' : 'grid-cols-2'} gap-4 md:gap-8 pt-6 mt-4 border-t border-stone-400/30 items-end`}>
            
            {heraldryPosition === 'signature-left' && heraldryImage && (
              <div className="flex flex-col items-center justify-center pb-2">
                 <img 
                    src={heraldryImage} 
                    alt="Sigil" 
                    className="object-contain" 
                    style={{ width: `${80 * heraldryScale}px`, height: `${80 * heraldryScale}px` }}
                 />
              </div>
            )}

            <div className="flex flex-col items-center gap-1">
              <div className={editableClass} onClick={(e) => handleEdit('date', e)}>
                 {editableHint}
                 <span className={`font-bold ${theme.accentColor}`} style={{ fontFamily: signatureFont, fontSize: `${sSize}px` }}>{date}</span>
              </div>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">Given This Day</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className={editableClass} onClick={(e) => handleEdit('giver', e)}>
                 {editableHint}
                 <span className={`font-bold ${theme.accentColor}`} style={{ fontFamily: signatureFont, fontSize: `${sSize}px` }}>{giver}</span>
              </div>
              <span className="text-sm uppercase tracking-widest text-stone-500 font-sans">By The Hand Of</span>
            </div>

            {heraldryPosition === 'signature-right' && heraldryImage && (
              <div className="flex flex-col items-center justify-center pb-2">
                 <img 
                    src={heraldryImage} 
                    alt="Sigil" 
                    className="object-contain" 
                    style={{ width: `${80 * heraldryScale}px`, height: `${80 * heraldryScale}px` }}
                 />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};