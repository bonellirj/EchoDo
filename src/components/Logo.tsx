import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <img 
        src="/assets/images/general/echodo_nbg.png" 
        alt="EchoDo Logo" 
        className="h-8 w-auto"
      />
    </div>
  );
};

export default Logo; 