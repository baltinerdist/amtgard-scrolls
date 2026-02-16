import React, { useState } from 'react';
import { ScrollPreview } from './components/ScrollPreview';
import { EditorControls } from './components/EditorControls';
import { ScrollData } from './types';
import { DEFAULT_SCROLL_DATA } from './constants';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [scrollData, setScrollData] = useState<ScrollData>(DEFAULT_SCROLL_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fieldToFocus, setFieldToFocus] = useState<string | null>(null);

  const handleEditField = (field: string) => {
    setFieldToFocus(field);
    if (window.innerWidth < 768) {
      setMobileMenuOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-stone-900 overflow-hidden relative font-sans">
      
      {/* Mobile Toggle */}
      <div className="md:hidden absolute top-4 right-4 z-[60] no-print">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-stone-800 text-amber-500 rounded border border-stone-600 shadow-lg"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Controls */}
      <div className={`
        fixed inset-y-0 right-0 w-full md:w-auto md:relative transform transition-transform duration-300 ease-in-out z-50
        ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
         <EditorControls 
            data={scrollData} 
            onChange={setScrollData} 
            focusField={fieldToFocus}
            onFocusConsumed={() => setFieldToFocus(null)}
         />
      </div>

      {/* Main Preview Area */}
      <main className="flex-1 h-full relative flex flex-col">
        {/* Toolbar / Top Message (Visible on screen only) */}
        <div className="absolute top-0 left-0 w-full p-4 z-40 pointer-events-none no-print">
           <div className="inline-block bg-black/60 backdrop-blur text-stone-300 text-xs px-3 py-1 rounded border border-stone-700/50">
             Preview Mode - Click text to edit
           </div>
        </div>

        <ScrollPreview 
          data={scrollData} 
          onEditField={handleEditField}
        />
      </main>
    </div>
  );
};

export default App;