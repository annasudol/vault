import React from 'react';

type LogoProps = {
  size: 'sm' | 'md' | 'lg';
};

const Logo: React.FC<LogoProps> = ({ size }) => {
  let width;
  let height;
  switch (size) {
    case 'sm':
      width = 100;
      height = 22;
      break;
    case 'md':
      width = 140;
      height = 30;
      break;
    case 'lg':
      width = 180;
      height = 40;
      break;
    default:
      width = 140;
      height = 30;
  }

  return (
    <svg
      aria-label="Arrakis logo"
      width={width}
      height={height}
      viewBox="0 0 200 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#249361', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#3ECF8E', stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <text
        x="10"
        y="35"
        font-family="Arial, sans-serif"
        font-size="32"
        fill="url(#gradient)"
        font-weight="bold"
      >
        ARRAKIS
      </text>
    </svg>
  );
};

export { Logo };
