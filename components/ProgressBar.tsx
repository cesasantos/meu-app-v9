import React from 'react';

const ProgressBar: React.FC = () => {
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 overflow-hidden">
      <div 
        className="h-2.5 rounded-full animate-shimmer bg-gradient-to-r from-slate-200 via-green-500 to-slate-200 dark:from-slate-600 dark:via-green-500 dark:to-slate-600"
        style={{
          backgroundSize: '400% 100%',
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
