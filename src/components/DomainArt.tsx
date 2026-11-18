import React from 'react';
import { MathCategory } from '../../shared/types.ts';

interface DomainArtProps {
  category: MathCategory | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const DomainArt: React.FC<DomainArtProps> = ({ category, className = '', size = 'md' }) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { w: 48, h: 48, viewBox: '0 0 100 100' };
      case 'md':
        return { w: 96, h: 96, viewBox: '0 0 100 100' };
      case 'lg':
        return { w: 140, h: 140, viewBox: '0 0 100 100' };
      case 'hero':
        return { w: 180, h: 180, viewBox: '0 0 100 100' };
      default:
        return { w: 96, h: 96, viewBox: '0 0 100 100' };
    }
  };

  const { w, h, viewBox } = getDimensions();

  switch (category) {
    case 'NGUYEN_TO':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#d46262" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <polygon
            points="50,18 59,39 81,39 63,52 70,73 50,60 30,73 37,52 19,39 41,39"
            fill="#d46262"
            fillOpacity="0.14"
            stroke="#d46262"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="10" r="3.5" fill="#d46262" />
          <circle cx="88" cy="39" r="3" fill="#d46262" />
          <circle cx="12" cy="39" r="3" fill="#d46262" />
          <text x="50" y="56" textAnchor="middle" fill="#e58585" fontSize="16" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            P
          </text>
        </svg>
      );

    case 'CHINH_PHUONG':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="24" y="24" width="52" height="52" rx="4" stroke="#d97b43" strokeWidth="2" fill="#d97b43" fillOpacity="0.1" />
          <rect x="24" y="24" width="52" height="52" rx="4" stroke="#d97b43" strokeWidth="1.5" transform="rotate(45 50 50)" opacity="0.65" />
          <circle cx="36" cy="36" r="2" fill="#d97b43" />
          <circle cx="64" cy="36" r="2" fill="#d97b43" />
          <circle cx="36" cy="64" r="2" fill="#d97b43" />
          <circle cx="64" cy="64" r="2" fill="#d97b43" />
          <text x="50" y="56" textAnchor="middle" fill="#e69a6b" fontSize="18" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            x²
          </text>
        </svg>
      );

    case 'DAI_SO':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="50" y1="14" x2="50" y2="86" stroke="#d4963a" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <line x1="14" y1="50" x2="86" y2="50" stroke="#d4963a" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          <polygon points="50,18 82,50 50,82 18,50" stroke="#d4963a" strokeWidth="2" fill="#d4963a" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="18" stroke="#d4963a" strokeWidth="1.5" fill="none" />
          <text x="50" y="56" textAnchor="middle" fill="#e2aa54" fontSize="20" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            x
          </text>
        </svg>
      );

    case 'KHAI_CAN':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#7aa647" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <path
            d="M24 54 L33 54 L44 74 L61 28 L78 28"
            stroke="#8cb858"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="67" cy="48" r="3" fill="#8cb858" />
          <circle cx="75" cy="48" r="3" fill="#8cb858" opacity="0.6" />
        </svg>
      );

    case 'LUY_THUA':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#4ea87a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <polygon
            points="54,16 32,52 48,52 42,84 68,44 52,44"
            fill="#4ea87a"
            fillOpacity="0.16"
            stroke="#4ea87a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'AM_SO':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="38" stroke="#4c99b0" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <circle cx="50" cy="50" r="24" stroke="#4c99b0" strokeWidth="2" fill="#4c99b0" fillOpacity="0.12" />
          <line x1="34" y1="50" x2="66" y2="50" stroke="#72bcd1" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'CHIA_HET':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#5b87c4" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <polygon points="50,22 72,68 28,68" stroke="#5b87c4" strokeWidth="2" fill="#5b87c4" fillOpacity="0.12" strokeLinejoin="round" />
          <line x1="36" y1="50" x2="64" y2="50" stroke="#8ab0e3" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="40" r="2.8" fill="#8ab0e3" />
          <circle cx="50" cy="60" r="2.8" fill="#8ab0e3" />
        </svg>
      );

    case 'PHAN_SO':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#8874bd" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <polygon points="50,18 66,34 50,42 34,34" fill="#8874bd" fillOpacity="0.18" stroke="#8874bd" strokeWidth="1.8" />
          <line x1="24" y1="50" x2="76" y2="50" stroke="#a695d6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="50,58 66,66 50,82 34,66" fill="#8874bd" fillOpacity="0.18" stroke="#8874bd" strokeWidth="1.8" />
        </svg>
      );

    case 'TUYET_DOI':
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 16 L76 26 C76 54 50 80 50 82 C50 80 24 54 24 26 Z"
            fill="#b56bb8"
            fillOpacity="0.12"
            stroke="#b56bb8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="38" y1="36" x2="38" y2="62" stroke="#d190d4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="62" y1="36" x2="62" y2="62" stroke="#d190d4" strokeWidth="2.5" strokeLinecap="round" />
          <text x="50" y="54" textAnchor="middle" fill="#d190d4" fontSize="16" fontWeight="600" fontFamily="JetBrains Mono, monospace">
            x
          </text>
        </svg>
      );

    case 'UOC_BOI':
    default:
      return (
        <svg width={w} height={h} viewBox={viewBox} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,18 78,38 68,72 32,72 22,38" stroke="#c46b92" strokeWidth="1.8" fill="#c46b92" fillOpacity="0.1" />
          <line x1="50" y1="18" x2="50" y2="50" stroke="#c46b92" strokeWidth="1.5" opacity="0.6" />
          <line x1="78" y1="38" x2="50" y2="50" stroke="#c46b92" strokeWidth="1.5" opacity="0.6" />
          <line x1="22" y1="38" x2="50" y2="50" stroke="#c46b92" strokeWidth="1.5" opacity="0.6" />
          <line x1="68" y1="72" x2="50" y2="50" stroke="#c46b92" strokeWidth="1.5" opacity="0.6" />
          <line x1="32" y1="72" x2="50" y2="50" stroke="#c46b92" strokeWidth="1.5" opacity="0.6" />
          <circle cx="50" cy="50" r="5" fill="#c46b92" />
          <circle cx="50" cy="18" r="3" fill="#e08eb2" />
          <circle cx="78" cy="38" r="2.5" fill="#e08eb2" />
          <circle cx="22" cy="38" r="2.5" fill="#e08eb2" />
        </svg>
      );
  }
};
