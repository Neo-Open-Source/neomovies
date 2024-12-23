'use client';

import Image from 'next/image';

const GoogleIcon = () => (
  <Image 
    src="/google.svg" 
    alt="Google"
    width={18}
    height={18}
    style={{ 
      marginRight: '8px',
      pointerEvents: 'none'
    }} 
  />
);

export default GoogleIcon;
