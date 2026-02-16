import React from 'react';
import { Upload, X } from 'lucide-react';

interface HeraldryUploaderProps {
  image: string | null;
  position: 'top-left' | 'top-right' | 'bottom-center' | 'watermark';
  onImageChange: (image: string | null) => void;
  onPositionChange: (pos: 'top-left' | 'top-right' | 'bottom-center' | 'watermark') => void;
}

export const HeraldryUploader: React.FC<HeraldryUploaderProps> = ({
  image,
  position,
  onImageChange,
  onPositionChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-stone-800 rounded-lg border border-stone-600">
      <h3 className="text-amber-500 font-cinzel font-bold text-lg flex items-center gap-2">
        <Upload size={18} /> Heraldry & Sigils
      </h3>
      
      <div className="flex flex-col gap-3">
        {!image ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-600 border-dashed rounded-lg cursor-pointer bg-stone-700 hover:bg-stone-600 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-stone-400" />
              <p className="mb-2 text-sm text-stone-300"><span className="font-semibold">Click to upload</span> sigil</p>
              <p className="text-xs text-stone-500">PNG, JPG (Transparent recommended)</p>
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

        {image && (
           <div className="grid grid-cols-2 gap-2 mt-2">
             {(['top-left', 'top-right', 'bottom-center', 'watermark'] as const).map((pos) => (
               <button
                key={pos}
                onClick={() => onPositionChange(pos)}
                className={`px-3 py-2 text-xs uppercase font-bold rounded border transition-colors ${
                  position === pos 
                    ? 'bg-amber-700 border-amber-500 text-amber-50' 
                    : 'bg-stone-700 border-stone-600 text-stone-400 hover:bg-stone-600'
                }`}
               >
                 {pos.replace('-', ' ')}
               </button>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};
