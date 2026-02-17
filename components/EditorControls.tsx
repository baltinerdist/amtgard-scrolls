import React, { useState, useEffect, useRef } from 'react';
import { AwardType, ScrollData } from '../types';
import { FONTS, THEMES, BACKGROUNDS } from '../constants';
import { Scroll, Paintbrush, Printer, RotateCw, RectangleVertical, RectangleHorizontal, Minus, Plus, Frame, X, Image as ImageIcon } from 'lucide-react';
import { HeraldryUploader } from './HeraldryUploader';

interface EditorControlsProps {
  data: ScrollData;
  onChange: (data: ScrollData) => void;
  focusField: string | null;
  onFocusConsumed: () => void;
}

export const EditorControls: React.FC<EditorControlsProps> = ({ 
  data, 
  onChange, 
  focusField,
  onFocusConsumed
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'design' | 'border' | 'heraldry'>('text');
  
  // Refs for inputs
  const locationRef = useRef<HTMLInputElement>(null);
  const recipientRef = useRef<HTMLInputElement>(null);
  const awardTypeRef = useRef<HTMLSelectElement>(null);
  const customAwardNameRef = useRef<HTMLInputElement>(null);
  const awardLevelRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const giverRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  // Handle focus requests
  useEffect(() => {
    if (focusField) {
      setActiveTab('text');
      
      // Small timeout to allow tab switch and render to complete
      setTimeout(() => {
        const refs: Record<string, React.RefObject<HTMLElement | null>> = {
          location: locationRef,
          recipient: recipientRef,
          awardType: awardTypeRef,
          customAwardName: customAwardNameRef,
          awardLevel: awardLevelRef,
          date: dateRef,
          giver: giverRef,
          reason: reasonRef
        };

        const targetRef = refs[focusField];
        if (targetRef && targetRef.current) {
          targetRef.current.focus();
          targetRef.current.classList.add('ring-2', 'ring-amber-500');
          setTimeout(() => targetRef.current?.classList.remove('ring-2', 'ring-amber-500'), 1000);
        }
      }, 50);
      
      onFocusConsumed();
    }
  }, [focusField, onFocusConsumed]);

  const updateField = (field: keyof ScrollData, value: any) => {
    onChange({ ...data, [field]: value });
  };
  
  const updateBorder = (field: keyof ScrollData['border'], value: any) => {
    onChange({ 
      ...data, 
      border: { ...data.border, [field]: value } 
    });
  };

  const adjustFontSize = (field: keyof ScrollData, amount: number) => {
    const currentSize = data[field] as number;
    updateField(field, Math.max(8, currentSize + amount));
  };

  const handlePrint = () => {
    window.print();
  };

  const isLadderAward = [
    AwardType.WARRIOR, 
    AwardType.ROSE, 
    AwardType.SMITH, 
    AwardType.LION, 
    AwardType.OWL, 
    AwardType.GARBER, 
    AwardType.DRAGON
  ].includes(data.awardType as AwardType);

  return (
    <div className="h-full flex flex-col bg-stone-900 border-l border-stone-700 text-stone-100 overflow-hidden shadow-xl w-full md:w-[450px] no-print z-50">
      
      {/* Header */}
      <div className="p-6 bg-stone-950 border-b border-stone-700 shadow-md">
        <h2 className="text-2xl font-medieval text-amber-500 flex items-center gap-2">
          <Scroll className="w-6 h-6" /> Scribe's Tools
        </h2>
        <p className="text-xs text-stone-500 mt-1">Craft your award scroll with precision</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-700">
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'text' ? 'bg-stone-800 text-amber-500 border-b-2 border-amber-500' : 'text-stone-400 hover:text-stone-200'}`}
        >
          Details
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'design' ? 'bg-stone-800 text-amber-500 border-b-2 border-amber-500' : 'text-stone-400 hover:text-stone-200'}`}
        >
          Design
        </button>
        <button 
          onClick={() => setActiveTab('border')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'border' ? 'bg-stone-800 text-amber-500 border-b-2 border-amber-500' : 'text-stone-400 hover:text-stone-200'}`}
        >
          Border
        </button>
        <button 
          onClick={() => setActiveTab('heraldry')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'heraldry' ? 'bg-stone-800 text-amber-500 border-b-2 border-amber-500' : 'text-stone-400 hover:text-stone-200'}`}
        >
          Sigils
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-stone-600 scrollbar-track-transparent">
        
        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Realm / Location</label>
              <input 
                ref={locationRef}
                type="text" 
                value={data.location} 
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200 focus:border-amber-500 outline-none"
                placeholder="Amtgard"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Recipient Name</label>
              <input 
                ref={recipientRef}
                type="text" 
                value={data.recipient} 
                onChange={(e) => updateField('recipient', e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-amber-50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-serif text-lg"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Award Type</label>
                <select 
                  ref={awardTypeRef}
                  value={data.awardType}
                  onChange={(e) => updateField('awardType', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200 focus:border-amber-500 outline-none"
                >
                  {Object.values(AwardType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="Custom Award">Custom Award</option>
                </select>
              </div>

              {data.awardType === 'Custom Award' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs uppercase font-bold text-amber-500 mb-1">Custom Award Name</label>
                  <input 
                    ref={customAwardNameRef}
                    type="text" 
                    value={data.customAwardName} 
                    onChange={(e) => updateField('customAwardName', e.target.value)}
                    placeholder="e.g. Defender of the Gate"
                    className="w-full bg-stone-800 border border-amber-700/50 rounded p-2 text-stone-100 focus:border-amber-500 outline-none font-serif"
                  />
                </div>
              )}

              {(isLadderAward || data.awardType === 'Custom Award') && (
                 <div>
                    <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Award Level (Order)</label>
                    <div className="flex gap-2 items-center">
                      <select 
                        ref={awardLevelRef}
                        value={data.awardLevel}
                        onChange={(e) => updateField('awardLevel', parseInt(e.target.value))}
                        className="w-24 bg-stone-800 border border-stone-600 rounded p-2 text-stone-200 focus:border-amber-500 outline-none"
                      >
                        <option value={0}>None</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}{['st','nd','rd'][i] || 'th'}</option>
                        ))}
                      </select>
                      <span className="text-xs text-stone-500 italic">Select 'None' for unranked awards</span>
                    </div>
                 </div>
              )}

              <div>
                <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Date</label>
                <input 
                  ref={dateRef}
                  type="text" 
                  value={data.date} 
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Given By</label>
              <input 
                ref={giverRef}
                type="text" 
                value={data.giver} 
                onChange={(e) => updateField('giver', e.target.value)}
                className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200 focus:border-amber-500 outline-none font-serif"
              />
            </div>

            <div className="pt-4 border-t border-stone-700">
               <label className="block text-xs uppercase font-bold text-stone-400 mb-2">Reason for Award</label>
               <textarea 
                ref={reasonRef}
                value={data.reason} 
                onChange={(e) => updateField('reason', e.target.value)}
                rows={6}
                className="w-full bg-stone-900 border border-stone-600 rounded p-3 text-stone-200 focus:border-amber-500 outline-none resize-none font-serif leading-relaxed"
                placeholder="Enter the text of the award here..."
              />
            </div>
          </div>
        )}

        {/* DESIGN TAB */}
        {activeTab === 'design' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
               <label className="block text-xs uppercase font-bold text-stone-400 mb-2">Background Texture</label>
               <div className="grid grid-cols-3 gap-2">
                 {BACKGROUNDS.map(bg => (
                   <button
                     key={bg.id}
                     onClick={() => updateField('backgroundImage', bg.value)}
                     className={`relative aspect-[3/4] rounded-lg border-2 overflow-hidden group transition-all ${
                       data.backgroundImage === bg.value
                         ? 'border-amber-500 ring-1 ring-amber-500'
                         : 'border-stone-700 hover:border-stone-500'
                     }`}
                   >
                     {bg.value ? (
                       <img src={bg.value} alt={bg.label} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">
                         <X size={20} />
                       </div>
                     )}
                     <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-center font-bold text-stone-200 backdrop-blur-sm">
                       {bg.label}
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            <div className="pt-4 border-t border-stone-700">
              <label className="block text-xs uppercase font-bold text-stone-400 mb-2">Theme Colors</label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => updateField('theme', theme)}
                    className={`p-2 rounded border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      data.theme.id === theme.id 
                        ? 'bg-stone-800 border-amber-500 ring-1 ring-amber-500 text-white' 
                        : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${theme.bgGradient} border ${theme.borderColor}`}></div>
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-700">
               <label className="block text-xs uppercase font-bold text-stone-400 mb-2">Orientation</label>
               <div className="flex gap-2">
                 <button
                   onClick={() => updateField('orientation', 'portrait')}
                   className={`flex-1 py-2 flex items-center justify-center gap-2 rounded border text-sm font-bold transition-colors ${
                     data.orientation === 'portrait'
                       ? 'bg-amber-600 border-amber-500 text-white'
                       : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'
                   }`}
                 >
                   <RectangleVertical size={16} /> Portrait
                 </button>
                 <button
                   onClick={() => updateField('orientation', 'landscape')}
                   className={`flex-1 py-2 flex items-center justify-center gap-2 rounded border text-sm font-bold transition-colors ${
                     data.orientation === 'landscape'
                       ? 'bg-amber-600 border-amber-500 text-white'
                       : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'
                   }`}
                 >
                   <RectangleHorizontal size={16} /> Landscape
                 </button>
               </div>
            </div>

            <div className="pt-4 border-t border-stone-700 space-y-4">
               <h3 className="text-amber-500 font-bold uppercase text-sm flex items-center gap-2">
                 <Paintbrush size={16} /> Typography
               </h3>

               {[
                 { label: 'Award Title', fontField: 'titleFont' as const, sizeField: 'titleFontSize' as const },
                 { label: 'Recipient Name', fontField: 'recipientFont' as const, sizeField: 'recipientFontSize' as const },
                 { label: 'Body Text', fontField: 'bodyFont' as const, sizeField: 'bodyFontSize' as const },
                 { label: 'Signatures', fontField: 'signatureFont' as const, sizeField: 'signatureFontSize' as const },
               ].map((item) => (
                 <div key={item.fontField} className="bg-stone-800 p-3 rounded border border-stone-700">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-xs font-bold text-stone-400 uppercase">{item.label}</label>
                       <span className="text-[10px] text-stone-500">{data[item.sizeField]}px</span>
                    </div>
                    <div className="flex gap-2">
                       <select 
                         value={data[item.fontField]}
                         onChange={(e) => updateField(item.fontField, e.target.value)}
                         className="flex-1 bg-stone-900 border border-stone-600 rounded px-2 py-1 text-xs text-stone-200 focus:border-amber-500 outline-none"
                       >
                         {FONTS.map(f => (
                           <option key={f.value} value={f.value}>{f.label}</option>
                         ))}
                       </select>
                       
                       <div className="flex items-center border border-stone-600 rounded bg-stone-900">
                          <button 
                            onClick={() => adjustFontSize(item.sizeField, -2)}
                            className="p-1 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <button 
                            onClick={() => adjustFontSize(item.sizeField, 2)}
                            className="p-1 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* BORDER TAB */}
        {activeTab === 'border' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between">
                <h3 className="text-amber-500 font-bold uppercase text-sm flex items-center gap-2">
                  <Frame size={16} /> Celtic Knot Border
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={data.border.enabled} 
                    onChange={(e) => updateBorder('enabled', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
             </div>

             {data.border.enabled ? (
               <div className="space-y-4">
                 <div className="bg-stone-800 p-4 rounded border border-stone-700 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-stone-400 uppercase">Scale</label>
                            <span className="text-xs text-stone-500">{data.border.size}</span>
                          </div>
                          <input 
                            type="range" 
                            min="15" 
                            max="60" 
                            step="5"
                            value={data.border.size} 
                            onChange={(e) => updateBorder('size', parseInt(e.target.value))}
                            className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                       </div>
                       <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-bold text-stone-400 uppercase">Line Width</label>
                            <span className="text-xs text-stone-500">{data.border.strokeWidth}px</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="12" 
                            step="0.5"
                            value={data.border.strokeWidth} 
                            onChange={(e) => updateBorder('strokeWidth', parseFloat(e.target.value))}
                            className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                       </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                         <label className="text-xs font-bold text-stone-400 uppercase">Border Rows</label>
                         <span className="text-xs text-stone-500">{data.border.thickness}</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3].map(t => (
                          <button
                            key={t}
                            onClick={() => updateBorder('thickness', t)}
                            className={`flex-1 py-2 text-xs font-bold rounded border ${
                              data.border.thickness === t 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            {t} Row{t > 1 ? 's' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                       <div className="flex justify-between mb-1">
                         <label className="block text-xs uppercase font-bold text-stone-400">Knot Style</label>
                       </div>
                       <div className="flex gap-2">
                          <button
                            onClick={() => updateBorder('cornerStyle', 'round')}
                            className={`flex-1 py-2 text-xs font-bold rounded border ${
                              data.border.cornerStyle === 'round' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Rounded
                          </button>
                          <button
                            onClick={() => updateBorder('cornerStyle', 'sharp')}
                            className={`flex-1 py-2 text-xs font-bold rounded border ${
                              data.border.cornerStyle === 'sharp' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Angular
                          </button>
                           <button
                            onClick={() => updateBorder('cornerStyle', 'box')}
                            className={`flex-1 py-2 text-xs font-bold rounded border ${
                              data.border.cornerStyle === 'box' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Square
                          </button>
                       </div>
                    </div>

                    <div className={`transition-opacity duration-200 ${data.border.thickness < 3 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                       <div className="flex justify-between mb-1">
                         <label className="block text-xs uppercase font-bold text-stone-400">Weave Pattern</label>
                         {data.border.thickness < 3 && (
                           <span className="text-[10px] text-amber-500 italic">Requires 3+ Rows</span>
                         )}
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => updateBorder('pattern', 'braid')}
                            className={`py-2 text-xs font-bold rounded border ${
                              data.border.pattern === 'braid' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Standard Braid
                          </button>
                          <button
                            onClick={() => updateBorder('pattern', 'box')}
                            className={`py-2 text-xs font-bold rounded border ${
                              data.border.pattern === 'box' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Box Weave
                          </button>
                           <button
                            onClick={() => updateBorder('pattern', 'twist-x')}
                            className={`py-2 text-xs font-bold rounded border ${
                              data.border.pattern === 'twist-x' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Vert. Twist
                          </button>
                           <button
                            onClick={() => updateBorder('pattern', 'twist-y')}
                            className={`py-2 text-xs font-bold rounded border ${
                              data.border.pattern === 'twist-y' 
                                ? 'bg-amber-600 border-amber-500 text-white' 
                                : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                            }`}
                          >
                            Horz. Twist
                          </button>
                       </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-bold text-stone-400 uppercase">Margin Inset</label>
                        <span className="text-xs text-stone-500">{data.border.inset}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="50" 
                        step="5"
                        value={data.border.inset} 
                        onChange={(e) => updateBorder('inset', parseInt(e.target.value))}
                        className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                     <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-700">
                        <div>
                          <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Line Color</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={data.border.color}
                              onChange={(e) => updateBorder('color', e.target.value)}
                              className="h-8 w-full bg-transparent border border-stone-600 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                        <div>
                           <label className="block text-xs uppercase font-bold text-stone-400 mb-1">Inner / Ribbon</label>
                           <div className="flex items-center gap-2 h-8">
                             {data.border.innerColor ? (
                               <>
                                <input 
                                  type="color" 
                                  value={data.border.innerColor}
                                  onChange={(e) => updateBorder('innerColor', e.target.value)}
                                  className="h-full flex-grow bg-transparent border border-stone-600 rounded cursor-pointer"
                                />
                                <button 
                                  onClick={() => updateBorder('innerColor', undefined)}
                                  className="h-full px-2 text-red-400 hover:bg-stone-700 rounded"
                                  title="Remove Inner Color"
                                >
                                  <X size={14} />
                                </button>
                               </>
                             ) : (
                               <button 
                                 onClick={() => updateBorder('innerColor', '#fbbf24')} // Default gold
                                 className="w-full h-full text-xs bg-stone-700 text-stone-400 rounded border border-stone-600 hover:text-white"
                               >
                                 + Add Fill
                               </button>
                             )}
                           </div>
                        </div>
                    </div>
                 </div>
                 
                 <div className="p-3 bg-stone-800/50 rounded border border-stone-700 text-xs text-stone-500 italic">
                    Combine "Line Width" and "Inner Color" to create intricate ribbon effects. Increase Rows to 3 to use complex patterns.
                 </div>
               </div>
             ) : (
                <div className="text-center py-10 text-stone-500 border border-dashed border-stone-700 rounded-lg">
                  <Frame className="mx-auto w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Border disabled</p>
                </div>
             )}
           </div>
        )}

        {/* HERALDRY TAB */}
        {activeTab === 'heraldry' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <HeraldryUploader 
               image={data.heraldryImage}
               position={data.heraldryPosition}
               scale={data.heraldryScale}
               onImageChange={(img) => updateField('heraldryImage', img)}
               onPositionChange={(pos) => updateField('heraldryPosition', pos)}
               onScaleChange={(scale) => updateField('heraldryScale', scale)}
             />
             <div className="mt-6 text-xs text-stone-500 italic p-4 bg-stone-800/50 rounded border border-stone-700">
               <p>Tip: Use transparent PNGs for the best effect. You can position the sigil as a watermark behind the text or as a stamp in the corners.</p>
             </div>
           </div>
        )}

      </div>

      <div className="p-6 border-t border-stone-700 bg-stone-950 flex flex-col gap-3">
        <button 
          onClick={handlePrint}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Printer size={18} /> Print Scroll
        </button>
        <p className="text-center text-[10px] text-stone-600">
          Pro Tip: In print settings, enable "Background Graphics" and set margins to "None".
        </p>
      </div>
    </div>
  );
};