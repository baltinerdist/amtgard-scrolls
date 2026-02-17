import React, { useState, useEffect } from 'react';
import { Upload, X, Library, MoveDiagonal, Loader2 } from 'lucide-react';
import { OBJECTS } from '../constants';

interface HeraldryUploaderProps {
  image: string | null;
  position: 'top-left' | 'top-right' | 'bottom-center' | 'watermark' | 'signature-left' | 'signature-right';
  scale: number;
  onImageChange: (image: string | null) => void;
  onPositionChange: (pos: 'top-left' | 'top-right' | 'bottom-center' | 'watermark' | 'signature-left' | 'signature-right') => void;
  onScaleChange: (scale: number) => void;
}

export const HeraldryUploader: React.FC<HeraldryUploaderProps> = ({
  image,
  position,
  scale,
  onImageChange,
  onPositionChange,
  onScaleChange,
}) => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [objectColor, setObjectColor] = useState<string>('#1c1917');
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [svgCache, setSvgCache] = useState<Record<string, string>>({});

  const GHOST_INK = '#a8a29e';

  const toBase64 = (str: string) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    const fetchArchive = async () => {
      for (const obj of OBJECTS) {
        if (!svgCache[obj.id]) {
          try {
            const response = await fetch(obj.path);
            const rawSvg = await response.text();
            setSvgCache(prev => ({ ...prev, [obj.id]: rawSvg }));
          } catch (err) {
            console.error(`Archivist error: Failed to retrieve ${obj.label}`, err);
          }
        }
      }
    };
    fetchArchive();
  }, []);

  useEffect(() => {
    if (!image) {
      setActiveTemplate(null);
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
        setActiveTemplate(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const colorizeSvg = (svgString: string, color: string) => {
    const cleanContent = svgString
      .replace(/<\?xml.*\?>/gi, '')
      .replace(/fill="[^"]*"/gi, 'fill="currentColor"')
      .replace(/stroke="[^"]*"/gi, 'stroke="currentColor"')
      .replace(/<svg([^>]*)>([\s\S]*)<\/svg>/i, (match, attrs, body) => {
        return `<svg${attrs} fill="${color}" stroke="${color}"><g fill="${color}" stroke="${color}">${body}</g></svg>`;
      });
    
    const base64 = toBase64(cleanContent);
    return `data:image/svg+xml;base64,${base64}`;
  };

  const handleTemplateSelect = async (templateId: string) => {
    const template = OBJECTS.find(o => o.id === templateId);
    if (!template) return;

    setActiveTemplate(templateId);

    try {
      let rawSvg = svgCache[templateId];
      if (!rawSvg) {
        setLoadingIds(prev => new Set(prev).add(templateId));
        const response = await fetch(template.path);
        rawSvg = await response.text();
        setSvgCache(prev => ({ ...prev, [templateId]: rawSvg }));
        setLoadingIds(prev => {
          const next = new Set(prev);
          next.delete(templateId);
          return next;
        });
      }

      const dataUri = colorizeSvg(rawSvg, objectColor);
      onImageChange(dataUri);
    } catch (error) {
      console.error("Failed to load sigil from archives:", error);
    }
  };

  const handleColorChange = (newColor: string) => {
    setObjectColor(newColor);
    if (activeTemplate && svgCache[activeTemplate]) {
      const dataUri = colorizeSvg(svgCache[activeTemplate], newColor);
      onImageChange(dataUri);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-stone-800 rounded-lg border border-stone-600 shadow-inner">
        <h3 className="text-amber-500 font-cinzel font-bold text-sm uppercase mb-3 flex items-center gap-2">
          <Upload size={16} /> Custom Upload
        </h3>
        
        <div className="flex flex-col gap-3">
          {!image || activeTemplate ? (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-stone-600 border-dashed rounded-lg cursor-pointer bg-stone-700 hover:bg-stone-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-2 pb-3 text-center">
                <Upload className="w-6 h-6 mb-1 text-stone-400" />
                <p className="text-[10px] text-stone-300 uppercase font-bold tracking-tight">Upload Personal Heraldry</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="relative w-full h-32 bg-stone-900 rounded-lg flex items-center justify-center border border-stone-600 overflow-hidden group">
              <img src={image} alt="Heraldry" className="h-full object-contain" />
              <button
                onClick={() => onImageChange(null)}
                className="absolute top-2 right-2 p-1 bg-red-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-stone-800 rounded-lg border border-stone-600 shadow-inner">
         <h3 className="text-amber-500 font-cinzel font-bold text-sm uppercase mb-3 flex items-center gap-2">
          <Library size={16} /> Scribe's Archive
        </h3>

        <div className="mb-4">
           <label className="block text-[10px] font-bold text-stone-400 mb-2 uppercase tracking-widest">Archival Sigils</label>
           <div className="grid grid-cols-4 gap-2">
             {OBJECTS.map((obj) => {
               const isLoaded = !!svgCache[obj.id];
               const previewSrc = isLoaded ? colorizeSvg(svgCache[obj.id], GHOST_INK) : '';

               return (
                 <button
                   key={obj.id}
                   onClick={() => handleTemplateSelect(obj.id)}
                   className={`relative aspect-square rounded border transition-all flex items-center justify-center p-2 group ${
                     activeTemplate === obj.id 
                       ? 'bg-stone-700 border-amber-500 ring-1 ring-amber-500' 
                       : 'bg-stone-900 border-stone-700 hover:border-stone-500 hover:bg-stone-800'
                   }`}
                   title={obj.label}
                 >
                   {!isLoaded ? (
                     <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
                        <img 
                          src={previewSrc} 
                          alt={obj.label} 
                          className={`w-full h-full object-contain transition-all pointer-events-none ${activeTemplate === obj.id ? 'opacity-100 scale-110' : 'opacity-40 group-hover:opacity-100'}`} 
                        />
                     </div>
                   )}
                 </button>
               );
             })}
           </div>
        </div>

        <div className="space-y-4">
           {activeTemplate && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                 <label className="block text-[10px] font-bold text-stone-400 mb-2 uppercase tracking-widest text-center">Tincture (Ink Color)</label>
                 <div className="flex gap-2 items-center justify-center">
                    <input 
                      type="color" 
                      value={objectColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-8 w-12 bg-transparent border border-stone-600 rounded cursor-pointer"
                    />
                    <div className="flex gap-1">
                       {['#1c1917', '#7f1d1d', '#1e3a8a', '#14532d', '#b45309', '#ffffff'].map(c => (
                         <button
                           key={c}
                           onClick={() => handleColorChange(c)}
                           className={`w-6 h-6 rounded-full border border-stone-600 shadow-sm transition-transform hover:scale-110 ${objectColor === c ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-stone-800 scale-110' : ''}`}
                           style={{ backgroundColor: c }}
                         />
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {image && (
             <div className="animate-in fade-in slide-in-from-top-1 duration-200 pt-2 border-t border-stone-700/50">
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                      <MoveDiagonal size={12} /> Sigil Size
                   </label>
                   <span className="text-[10px] text-stone-500 font-mono font-bold">{Math.round(scale * 100)}%</span>
                </div>
                <input 
                   type="range"
                   min="0.1"
                   max="3.0"
                   step="0.05"
                   value={scale}
                   onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                   className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
             </div>
           )}
        </div>
      </div>

      {image && (
         <div className="p-4 bg-stone-800 rounded-lg border border-stone-600 shadow-inner">
           <label className="block text-[10px] uppercase font-bold text-stone-400 mb-2 tracking-widest text-center">Sigil Position</label>
           <div className="grid grid-cols-2 gap-2">
             {(['top-left', 'top-right', 'bottom-center', 'signature-left', 'signature-right', 'watermark'] as const).map((pos) => (
               <button
                key={pos}
                onClick={() => onPositionChange(pos)}
                className={`px-3 py-2 text-[10px] uppercase font-bold rounded border transition-colors ${
                  position === pos 
                    ? 'bg-amber-700 border-amber-500 text-amber-50 shadow-lg shadow-amber-900/40' 
                    : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                }`}
               >
                 {pos.replace('-', ' ')}
               </button>
             ))}
           </div>
         </div>
      )}
    </div>
  );
};