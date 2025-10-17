import React from 'react';

export const RedCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="text-red-500"
    {...props}
  >
    <path d="M4 4h8.31c.23 0 .45.09.62.26l4.82 4.82c.17.17.26.39.26.62V20c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
  </svg>
);