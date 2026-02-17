import React, { useMemo, useId } from 'react';

interface CelticBorderProps {
  width: number;
  height: number;
  size: number;
  thickness: number; 
  inset: number;
  color: string;
  strokeWidth?: number; // Visual thickness in pixels
  innerColor?: string; // If provided, creates a ribbon effect
  pattern?: 'braid' | 'twist-x' | 'twist-y' | 'box';
  cornerStyle?: 'round' | 'sharp' | 'box';
  heraldryPosition?: 'top-left' | 'top-right' | 'bottom-center' | 'watermark' | 'signature-left' | 'signature-right';
  heraldryScale?: number;
  hasHeraldry?: boolean;
}

export const CelticBorder: React.FC<CelticBorderProps> = ({ 
  width, 
  height, 
  size = 20, 
  thickness = 2,
  inset = 0,
  color = 'currentColor',
  strokeWidth = 3,
  innerColor,
  pattern = 'braid',
  cornerStyle = 'round',
  heraldryPosition,
  heraldryScale = 1.0,
  hasHeraldry = false
}) => {
  const uniqueId = useId();

  // Calculate grid dimensions
  const innerWidth = width - (inset * 2);
  const innerHeight = height - (inset * 2);

  // CRITICAL: For perfect symmetry in an A-B-A repeating weave, we MUST have an ODD number of columns and rows.
  // This ensures the pattern starts and ends on the same "beat".
  let cols = Math.floor(innerWidth / size);
  if (cols % 2 === 0) cols -= 1;
  
  let rows = Math.floor(innerHeight / size);
  if (rows % 2 === 0) rows -= 1;

  // Center the grid within the parchment
  const xOffset = inset + (innerWidth - (cols * size)) / 2;
  const yOffset = inset + (innerHeight - (rows * size)) / 2;

  const svgStrokeWidth = strokeWidth * (100 / size);
  const visualGapPx = 2.5;
  const svgGapSize = svgStrokeWidth + (visualGapPx * (100/size)); 
  const gapId = Math.round(svgGapSize * 100); 
  const innerStrokeWidth = Math.max(1, svgStrokeWidth * 0.4);

  const strokeLinejoin = cornerStyle === 'round' ? 'round' : 'miter';
  const strokeLinecap = 'round'; 

  const getPaths = () => {
    switch (cornerStyle) {
      case 'sharp':
        return {
          'corner-tl': 'M100,0 L0,0 L0,100',
          'corner-tr': 'M0,0 L100,0 L100,100',
          'corner-bl': 'M100,100 L0,100 L0,0',
          'corner-br': 'M0,100 L100,100 L100,0',
          'edge-top': 'M0,100 L50,0 L100,100',
          'edge-bottom': 'M0,0 L50,100 L100,0',
          'edge-left': 'M100,0 L0,50 L100,100',
          'edge-right': 'M0,0 L100,50 L0,100',
          'inner-corner-tl': 'M100,0 L0,0 L0,100',
          'inner-corner-tr': 'M0,0 L100,0 L100,100',
          'inner-corner-bl': 'M100,100 L0,100 L0,0',
          'inner-corner-br': 'M0,100 L100,100 L100,0'
        };
      case 'box':
        return {
          'corner-tl': 'M100,0 L0,0 L0,100',
          'corner-tr': 'M0,0 L100,0 L100,100',
          'corner-bl': 'M100,100 L0,100 L0,0',
          'corner-br': 'M0,100 L100,100 L100,0',
          'edge-top': 'M0,100 L0,20 L100,20 L100,100',
          'edge-bottom': 'M0,0 L0,80 L100,80 L100,0',
          'edge-left': 'M100,0 L20,0 L20,100 L100,100',
          'edge-right': 'M0,0 L80,0 L80,100 L0,100',
          'inner-corner-tl': 'M100,0 L0,0 L0,100',
          'inner-corner-tr': 'M0,0 L100,0 L100,100',
          'inner-corner-bl': 'M100,100 L0,100 L0,0',
          'inner-corner-br': 'M0,100 L100,100 L100,0'
        };
      case 'round':
      default:
        return {
          'corner-tl': 'M100,0 Q0,0 0,100',
          'corner-tr': 'M0,0 Q100,0 100,100',
          'corner-bl': 'M0,0 Q0,100 100,100',
          'corner-br': 'M0,100 Q100,100 100,0',
          'edge-top': 'M0,100 C20,20 80,20 100,100',
          'edge-bottom': 'M0,0 C20,80 80,80 100,0',
          'edge-left': 'M100,0 C20,20 20,80 100,100',
          'edge-right': 'M0,0 C80,20 80,80 0,100',
          'inner-corner-tl': 'M100,0 Q0,0 0,100',
          'inner-corner-tr': 'M0,0 Q100,0 100,100',
          'inner-corner-bl': 'M0,0 Q0,100 100,100',
          'inner-corner-br': 'M0,100 Q100,100 100,0'
        };
    }
  };

  const stylePaths = getPaths();

  const tiles = useMemo(() => {
    const tileArray = [];
    const midX = Math.floor(cols / 2);
    // Gap radius clears the sigil area
    const gapRadius = Math.ceil(heraldryScale * 2.5);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const distLeft = x;
        const distRight = cols - 1 - x;
        const distTop = y;
        const distBottom = rows - 1 - y;

        const isBorder = distLeft < thickness || distRight < thickness || distTop < thickness || distBottom < thickness;
        const isInnerVoid = distLeft >= thickness && distRight >= thickness && distTop >= thickness && distBottom >= thickness;

        if (!isBorder || isInnerVoid) continue;

        // Window Cutout Logic: Only activate if hasHeraldry is TRUE and it is bottom-center
        if (hasHeraldry && 
            heraldryPosition === 'bottom-center' && 
            distBottom < thickness && 
            x >= midX - gapRadius && 
            x <= midX + gapRadius) {
          continue;
        }

        let type = 'cross';
        const isTopEdge = distTop === 0;
        const isBottomEdge = distBottom === 0;
        const isLeftEdge = distLeft === 0;
        const isRightEdge = distRight === 0;
        const isInnerTopEdge = distTop === thickness - 1;
        const isInnerBottomEdge = distBottom === thickness - 1;
        const isInnerLeftEdge = distLeft === thickness - 1;
        const isInnerRightEdge = distRight === thickness - 1;

        if (isTopEdge && isLeftEdge) type = 'corner-tl';
        else if (isTopEdge && isRightEdge) type = 'corner-tr';
        else if (isBottomEdge && isLeftEdge) type = 'corner-bl';
        else if (isBottomEdge && isRightEdge) type = 'corner-br';
        else if (thickness > 1 && isInnerTopEdge && isInnerLeftEdge) type = 'inner-corner-tl';
        else if (thickness > 1 && isInnerTopEdge && isInnerRightEdge) type = 'inner-corner-tr';
        else if (thickness > 1 && isInnerBottomEdge && isInnerLeftEdge) type = 'inner-corner-bl';
        else if (thickness > 1 && isInnerBottomEdge && isInnerRightEdge) type = 'inner-corner-br';
        else if (isTopEdge) type = 'edge-top';
        else if (isBottomEdge) type = 'edge-bottom';
        else if (isLeftEdge) type = 'edge-left';
        else if (isRightEdge) type = 'edge-right';
        else if (thickness > 1 && isInnerTopEdge) type = 'edge-bottom';
        else if (thickness > 1 && isInnerBottomEdge) type = 'edge-top';
        else if (thickness > 1 && isInnerLeftEdge) type = 'edge-right';
        else if (thickness > 1 && isInnerRightEdge) type = 'edge-left';
        else {
           if (pattern === 'box') {
             type = (x + y) % 2 === 0 ? 'box-v' : 'box-h';
           } else if (pattern === 'twist-x') {
             type = x % 2 === 0 ? 'cross-a' : 'box-v';
           } else if (pattern === 'twist-y') {
             type = y % 2 === 0 ? 'cross-a' : 'box-h';
           } else {
             type = (x + y) % 2 === 0 ? 'cross-a' : 'cross-b';
           }
        }

        tileArray.push({ x: x * size + xOffset, y: y * size + yOffset, type });
      }
    }
    return tileArray;
  }, [cols, rows, size, thickness, xOffset, yOffset, pattern, heraldryPosition, heraldryScale, hasHeraldry]);

  const resolvePathId = (baseName: string) => {
    const key = baseName.replace('path-', '');
    if (Object.prototype.hasOwnProperty.call(stylePaths, key)) {
       return `${baseName}-${cornerStyle}`;
    }
    return baseName;
  };

  const RenderStrand = ({ pathId, maskId }: { pathId: string, maskId?: string }) => {
    const effectivePathId = resolvePathId(pathId);
    return (
      <g mask={maskId ? `url(#${maskId})` : undefined}>
        <use 
          href={`#${effectivePathId}`} 
          stroke={color} 
          strokeWidth={svgStrokeWidth} 
          fill="none" 
          strokeLinecap={strokeLinecap} 
          strokeLinejoin={strokeLinejoin}
          strokeMiterlimit="10" 
        />
        {innerColor && (
          <use 
            href={`#${effectivePathId}`} 
            stroke={innerColor} 
            strokeWidth={innerStrokeWidth} 
            fill="none" 
            strokeLinecap={strokeLinecap} 
            strokeLinejoin={strokeLinejoin}
            strokeMiterlimit="10"
          />
        )}
      </g>
    );
  };

  const maskPrefix = `mask-${uniqueId}-${gapId}`;

  return (
    <svg 
      width={width} 
      height={height} 
      className="absolute top-0 left-0 pointer-events-none z-20 overflow-visible"
    >
      <defs>
        <path id="path-cross-a-under" d="M0,100 L100,0" />
        <path id="path-cross-a-over" d="M0,0 L100,100" />
        <path id="path-cross-b-under" d="M0,0 L100,100" />
        <path id="path-cross-b-over" d="M0,100 L100,0" />
        <path id={`path-corner-tl-${cornerStyle}`} d={stylePaths['corner-tl']} />
        <path id={`path-corner-tr-${cornerStyle}`} d={stylePaths['corner-tr']} />
        <path id={`path-corner-bl-${cornerStyle}`} d={stylePaths['corner-bl']} />
        <path id={`path-corner-br-${cornerStyle}`} d={stylePaths['corner-br']} />
        <path id={`path-edge-top-${cornerStyle}`} d={stylePaths['edge-top']} />
        <path id={`path-edge-bottom-${cornerStyle}`} d={stylePaths['edge-bottom']} />
        <path id={`path-edge-left-${cornerStyle}`} d={stylePaths['edge-left']} />
        <path id={`path-edge-right-${cornerStyle}`} d={stylePaths['edge-right']} />
        <path id={`path-inner-corner-tl-${cornerStyle}`} d={stylePaths['inner-corner-tl']} />
        <path id={`path-inner-corner-tr-${cornerStyle}`} d={stylePaths['inner-corner-tr']} />
        <path id={`path-inner-corner-bl-${cornerStyle}`} d={stylePaths['inner-corner-bl']} />
        <path id={`path-inner-corner-br-${cornerStyle}`} d={stylePaths['inner-corner-br']} />
        <mask id={`${maskPrefix}-cross-a-over`} maskUnits="userSpaceOnUse">
           <rect x="-50" y="-50" width="200" height="200" fill="white" />
           <path d="M0,0 L100,100" stroke="black" strokeWidth={svgGapSize} fill="none" strokeLinecap="round" />
        </mask>
        <mask id={`${maskPrefix}-cross-b-over`} maskUnits="userSpaceOnUse">
           <rect x="-50" y="-50" width="200" height="200" fill="white" />
           <path d="M0,100 L100,0" stroke="black" strokeWidth={svgGapSize} fill="none" strokeLinecap="round" />
        </mask>
      </defs>
      {tiles.map((tile, i) => {
         const transform = `translate(${tile.x}, ${tile.y}) scale(${size/100})`;
         if (tile.type === 'cross-a') return <g key={i} transform={transform}><RenderStrand pathId="path-cross-a-under" maskId={`${maskPrefix}-cross-a-over`} /><RenderStrand pathId="path-cross-a-over" /></g>;
         if (tile.type === 'cross-b') return <g key={i} transform={transform}><RenderStrand pathId="path-cross-b-under" maskId={`${maskPrefix}-cross-b-over`} /><RenderStrand pathId="path-cross-b-over" /></g>;
         if (tile.type === 'box-v') return <g key={i} transform={transform}><RenderStrand pathId="path-edge-right" /><RenderStrand pathId="path-edge-left" /></g>;
         if (tile.type === 'box-h') return <g key={i} transform={transform}><RenderStrand pathId="path-edge-bottom" /><RenderStrand pathId="path-edge-top" /></g>;
         return <g key={i} transform={transform}><RenderStrand pathId={`path-${tile.type}`} /></g>;
      })}
    </svg>
  );
};