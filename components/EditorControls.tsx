import React, { useState, useEffect, useRef } from 'react';
import { AwardType, ScrollData } from '../types';
import { FONTS, THEMES } from '../constants';
import { Scroll, Paintbrush, Printer, RotateCw, RectangleVertical, RectangleHorizontal, Minus, Plus } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'text' | 'design' | 'heraldry'>('text');
  
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

              {/* Order Level Selector - Show for custom or ladder awards */}
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
            
            {/* Orientation Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-700">
               <div className="flex items-center gap-2 text-stone-400">
                 <RotateCw size={16} />
                 <span className="text-xs font-bold uppercase">Orientation</span>
               </div>
               <div className="flex bg-stone-800 rounded p-1 border border-stone-700">
                 <button 
                  onClick={() => updateField('orientation', 'portrait')}
                  className={`p-2 rounded transition-colors ${data.orientation === 'portrait' ? 'bg-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
                  title="Portrait"
                 >
                   <RectangleVertical size={18} />
                 </button>
                 <button 
                  onClick={() => updateField('orientation', 'landscape')}
                  className={`p-2 rounded transition-colors ${data.orientation === 'landscape' ? 'bg-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
                  title="Landscape"
                 >
                   <RectangleHorizontal size={18} />
                 </button>
               </div>
            </div>

            <div>
              <h3 className="text-stone-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                <Paintbrush size={14} /> Theme Style
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => updateField('theme', theme)}
                    className={`relative p-3 rounded border-2 text-left transition-all overflow-hidden group ${
                      data.theme.id === theme.id 
                        ? 'border-amber-500 bg-stone-800' 
                        : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <span className={`relative z-10 font-bold ${data.theme.id === theme.id ? 'text-amber-500' : 'text-stone-300'}`}>
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-stone-700">
              <h3 className="text-stone-400 text-xs font-bold uppercase mb-1">Typography</h3>
              
              {/* TITLE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-stone-300">Title</label>
                  <div className="flex items-center gap-1 bg-stone-800 rounded border border-stone-700 p-0.5">
                    <button onClick={() => adjustFontSize('titleFontSize', -4)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => adjustFontSize('titleFontSize', 4)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {FONTS.map(font => (
                    <button
                      key={`title-${font.value}`}
                      onClick={() => updateField('titleFont', font.value)}
                      className={`px-3 py-2 text-left text-sm rounded border transition-all flex justify-between items-center ${
                        data.titleFont === font.value 
                          ? 'bg-amber-900/30 border-amber-600 text-amber-500' 
                          : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className="truncate">{font.label.split(' ')[0]}</span>
                      {data.titleFont === font.value && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

               <div className="mt-4 grid grid-cols-1 gap-5">
                  {/* RECIPIENT */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-stone-300">Recipient</label>
                      <div className="flex items-center gap-1 bg-stone-800 rounded border border-stone-700 p-0.5">
                        <button onClick={() => adjustFontSize('recipientFontSize', -4)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => adjustFontSize('recipientFontSize', 4)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <select 
                      value={data.recipientFont}
                      onChange={(e) => updateField('recipientFont', e.target.value)}
                      className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200"
                    >
                      {FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* BODY TEXT */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-stone-300">Body Text</label>
                      <div className="flex items-center gap-1 bg-stone-800 rounded border border-stone-700 p-0.5">
                        <button onClick={() => adjustFontSize('bodyFontSize', -2)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => adjustFontSize('bodyFontSize', 2)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <select 
                      value={data.bodyFont}
                      onChange={(e) => updateField('bodyFont', e.target.value)}
                      className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200"
                    >
                      {FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* SIGNATURE */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-stone-300">Signature</label>
                      <div className="flex items-center gap-1 bg-stone-800 rounded border border-stone-700 p-0.5">
                        <button onClick={() => adjustFontSize('signatureFontSize', -2)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                          <Minus size={14} />
                        </button>
                        <button onClick={() => adjustFontSize('signatureFontSize', 2)} className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <select 
                      value={data.signatureFont}
                      onChange={(e) => updateField('signatureFont', e.target.value)}
                      className="w-full bg-stone-800 border border-stone-600 rounded p-2 text-stone-200"
                    >
                      {FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* HERALDRY TAB */}
        {activeTab === 'heraldry' && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <HeraldryUploader 
               image={data.heraldryImage}
               position={data.heraldryPosition}
               onImageChange={(img) => updateField('heraldryImage', img)}
               onPositionChange={(pos) => updateField('heraldryPosition', pos)}
             />
             <div className="mt-6 text-xs text-stone-500 italic p-4 bg-stone-800/50 rounded border border-stone-700">
               <p>Tip: Use transparent PNGs for the best effect. You can position the sigil as a watermark behind the text or as a stamp in the corners.</p>
             </div>
           </div>
        )}

      </div>

      {/* Footer / Actions */}
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