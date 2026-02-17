import { AwardTheme, AwardType, ScrollFont } from './types';

// Embedded SVG Parchment Texture
const PARCHMENT_SVG = `data:image/svg+xml;charset=utf-8,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23e8dcb9' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23e8dcb9'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.6'/%3E%3Crect width='100%25' height='100%25' fill='%23d4c5a5' opacity='0.2'/%3E%3C/svg%3E`;

export const OBJECTS = [
  { id: 'anvil', label: 'Anvil', path: 'assets/objects/anvil.svg' },
  { id: 'battle-dragon', label: 'Battle with Dragon', path: 'assets/objects/battle-dragon.svg' },
  { id: 'castle', label: 'Castle', path: 'assets/objects/castle.svg' },
  { id: 'crown', label: 'Crown', path: 'assets/objects/crown.svg' },
  { id: 'crown-2', label: 'Crown 2', path: 'assets/objects/crown-2.svg' },
  { id: 'dragon', label: 'Dragon', path: 'assets/objects/dragon.svg' },
  { id: 'dragon-2', label: 'Dragon 2', path: 'assets/objects/dragon-2.svg' },
  { id: 'drama-masks', label: 'Drama Masks', path: 'assets/objects/drama-masks.svg' },
  { id: 'flame', label: 'Flame', path: 'assets/objects/flame.svg' },
  { id: 'flame-knot', label: 'Flame Knot', path: 'assets/objects/flame-knot.svg' },
  { id: 'flame-torch', label: 'Flame Torch', path: 'assets/objects/flame-torch.svg' },
  { id: 'flame-torch-2', label: 'Flame Torch 2', path: 'assets/objects/flame-torch-2.svg' },
  { id: 'fleur-de-lis', label: 'Fleur de Lis', path: 'assets/objects/fleur-de-lis.svg' },
  { id: 'herald', label: 'Herald', path: 'assets/objects/herald.svg' },
  { id: 'knight', label: 'Gallant Knight', path: 'assets/objects/knight.svg' },
  { id: 'lion-sword', label: 'Warrior / Lion', path: 'assets/objects/lion-sword.svg' },
  { id: 'mallet', label: 'Mallet', path: 'assets/objects/mallet.svg' },
  { id: 'mask', label: 'Mask', path: 'assets/objects/mask.svg' },
  { id: 'owl', label: 'Owl', path: 'assets/objects/owl.svg' },
  { id: 'rose-scroll', label: 'Rose in Scroll', path: 'assets/objects/rose-scroll.svg' },
  { id: 'rose-2', label: 'Rose 2', path: 'assets/objects/rose-2.svg' },
  { id: 'scissors', label: 'Scissors', path: 'assets/objects/scissors.svg' },
  { id: 'sword', label: 'Sword', path: 'assets/objects/sword.svg' },
  { id: 'unicorn', label: 'Unicorn', path: 'assets/objects/unicorn.svg' },
  { id: 'zodiac', label: 'Zodiac', path: 'assets/objects/zodiac.svg' },
  { id: 'bow', label: 'Archer / Bow', path: 'assets/objects/bow-and-arrow.svg' },
  { id: 'griffon', label: 'Order of the Griffon', path: 'assets/objects/griffon.svg' },
  { id: 'joker', label: 'Order of the Joker', path: 'assets/objects/joker.svg' },
];

export const BACKGROUNDS = [
  { id: 'none', label: 'None', value: null },
  { id: 'parchment-1', label: 'Aged Parchment', value: PARCHMENT_SVG },
];

export const DEFAULT_SCROLL_DATA = {
  location: 'Amtgard',
  recipient: 'Lady Alara',
  awardType: AwardType.WARRIOR,
  customAwardName: '',
  awardLevel: 1,
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  giver: 'King Arion',
  reason: 'For valor shown upon the field of battle against the goblin hordes, demonstrating skill with sword and shield unsurpassed by her peers.',
  theme: {
    id: 'warrior',
    name: 'Warrior Red',
    bgGradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-red-900',
    accentColor: 'text-red-900',
    textureOpacity: 0.1,
  },
  backgroundImage: null,
  titleFont: ScrollFont.ANCIENT,
  bodyFont: ScrollFont.CINZEL,
  recipientFont: ScrollFont.ANCIENT,
  signatureFont: ScrollFont.ANCIENT,
  heraldryImage: null,
  heraldryPosition: 'bottom-center' as const,
  heraldryScale: 0.6,
  
  // Border Defaults
  border: {
    enabled: true,
    size: 25,
    thickness: 3,
    inset: 15,
    color: '#7f1d1d',
    strokeWidth: 4,
    innerColor: '#fcd34d',
    pattern: 'braid' as const,
    cornerStyle: 'round' as const,
  },
  
  // Layout Defaults
  orientation: 'portrait' as const,
  titleFontSize: 64,
  recipientFontSize: 56,
  bodyFontSize: 24,
  signatureFontSize: 24,
};

export const THEMES: AwardTheme[] = [
  {
    id: 'warrior',
    name: 'Warrior Red',
    bgGradient: 'from-orange-50 to-orange-100',
    borderColor: 'border-red-800',
    accentColor: 'text-red-900',
    textureOpacity: 0.2,
  },
  {
    id: 'dragon',
    name: 'Dragon Green',
    bgGradient: 'from-emerald-50 to-green-100',
    borderColor: 'border-emerald-800',
    accentColor: 'text-emerald-900',
    textureOpacity: 0.15,
  },
  {
    id: 'rose',
    name: 'Rose White',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-400',
    accentColor: 'text-rose-800',
    textureOpacity: 0.1,
  },
  {
    id: 'smith',
    name: 'Smith Iron',
    bgGradient: 'from-stone-100 to-stone-200',
    borderColor: 'border-stone-700',
    accentColor: 'text-stone-800',
    textureOpacity: 0.3,
  },
  {
    id: 'lion',
    name: 'Lion Gold',
    bgGradient: 'from-yellow-50 to-amber-100',
    borderColor: 'border-yellow-600',
    accentColor: 'text-amber-800',
    textureOpacity: 0.15,
  },
  {
    id: 'owl',
    name: 'Owl Blue',
    bgGradient: 'from-slate-50 to-blue-50',
    borderColor: 'border-blue-800',
    accentColor: 'text-blue-900',
    textureOpacity: 0.1,
  },
   {
    id: 'necromantic',
    name: 'Dark Arts',
    bgGradient: 'from-stone-300 to-stone-400',
    borderColor: 'border-black',
    accentColor: 'text-purple-900',
    textureOpacity: 0.4,
  },
];

export const FONTS = [
  { label: 'Medieval Sharp', value: ScrollFont.MEDIEVAL },
  { label: 'Cinzel (Roman)', value: ScrollFont.CINZEL },
  { label: 'Grenze Gotisch (Blackletter)', value: ScrollFont.GOTHIC },
  { label: 'Pirata One (Gothic)', value: ScrollFont.PIRATE },
  { label: 'Uncial Antiqua (Celtic)', value: ScrollFont.ANCIENT },
  { label: 'IM Fell English SC (Print)', value: ScrollFont.PRINT },
  { label: 'Marcellus SC (Classic)', value: ScrollFont.ROMAN },
  { label: 'Great Vibes (Script)', value: ScrollFont.SCRIPT },
  { label: 'Pinyon Script (Royal)', value: ScrollFont.ROYAL },
  { label: 'Italianno (Elegant)', value: ScrollFont.ITALIAN },
  { label: 'Tangerine (Tall)', value: ScrollFont.TALL },
];