export enum AwardType {
  WARRIOR = 'Order of the Warrior',
  ROSE = 'Order of the Rose',
  SMITH = 'Order of the Smith',
  LION = 'Order of the Lion',
  OWL = 'Order of the Owl',
  GARBER = 'Order of the Garber',
  DRAGON = 'Order of the Dragon',
  PARAGON = 'Paragon',
  GENERIC = 'Award of Recognition'
}

export enum ScrollFont {
  MEDIEVAL = 'MedievalSharp',
  CINZEL = 'Cinzel',
  SCRIPT = 'Great Vibes',
  ANCIENT = 'Uncial Antiqua',
  ROYAL = 'Pinyon Script',
  GOTHIC = 'Grenze Gotisch',
  PIRATE = 'Pirata One',
  PRINT = 'IM Fell English SC',
  ITALIAN = 'Italianno',
  ROMAN = 'Marcellus SC',
  TALL = 'Tangerine'
}

export interface HeraldryPosition {
  x: number;
  y: number;
  scale: number;
}

export interface BorderConfig {
  enabled: boolean;
  size: number; // Cell size in pixels
  thickness: number; // Width in cells (1, 2, 3)
  inset: number; // Padding from edge
  color: string;
  strokeWidth: number; // Visual width of the line in pixels
  innerColor?: string; // Optional inner color for ribbon effect
  pattern: 'braid' | 'twist-x' | 'twist-y' | 'box'; // Tiling logic
  cornerStyle: 'round' | 'sharp' | 'box'; // Visual style of edges/corners
}

export interface ScrollData {
  location: string;
  recipient: string;
  awardType: AwardType | string;
  customAwardName: string;
  awardLevel: number; // 0 for none, 1-10 for ladder
  date: string;
  giver: string;
  reason: string;
  theme: AwardTheme;
  titleFont: ScrollFont;
  bodyFont: ScrollFont;
  recipientFont: ScrollFont;
  signatureFont: ScrollFont;
  heraldryImage: string | null; // base64
  heraldryPosition: 'top-left' | 'top-right' | 'bottom-center' | 'watermark';
  
  // Border
  border: BorderConfig;
  
  // Layout Properties
  orientation: 'portrait' | 'landscape';
  titleFontSize: number;
  recipientFontSize: number;
  bodyFontSize: number;
  signatureFontSize: number;
}

export interface AwardTheme {
  id: string;
  name: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  textureOpacity: number;
  icon?: string;
}