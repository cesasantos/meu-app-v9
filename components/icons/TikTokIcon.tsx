import React from 'react';

export const TikTokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 4h-4a8 8 0 0 0-8 8v4h4V8a4 4 0 0 1 4-4h4z"></path>
    <path d="M12 12v9"></path>
  </svg>
);
