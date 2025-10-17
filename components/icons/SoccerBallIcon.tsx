
import React from 'react';

export const SoccerBallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a5.5 5.5 0 0 0 0 10.5A5.5 5.5 0 0 0 12 22a5.5 5.5 0 0 0 0-10.5A5.5 5.5 0 0 0 12 2z" />
    <path d="M2 12h5.5" />
    <path d="M16.5 12H22" />
    <path d="M12 2v5.5" />
    <path d="M12 16.5V22" />
  </svg>
);
