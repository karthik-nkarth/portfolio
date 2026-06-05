import {  m  } from 'framer-motion';

const JourneyTimeline = () => {
  const milestones = [
    {
      id: 1,
      date: 'March 2019',
      title: 'Analyst',
      company: 'HCL Tech',
      description: 'Started out fixing enterprise tech issues and learning the ropes.',
    },
    {
      id: 2,
      date: 'April 2021',
      title: 'Senior Analyst',
      company: 'HCL Tech',
      description: 'Handled high-pressure global incidents and managed devices.',
    },
    {
      id: 3,
      date: 'March 2023',
      title: 'SME (Analytics)',
      company: 'Cognizant',
      description: 'Transitioned to Analytics, specializing in GA4 & GTM globally.',
    },
    {
      id: 4,
      date: 'January 2026',
      title: 'SME Team Lead',
      company: 'Cognizant',
      description: 'Architecting server-side setups and mentoring the team.',
    },
  ];

  const animationStyles = `
    /* Slow, Lazy Walk */
    @keyframes lazy-walk-leg-l { 0%, 100% { transform: rotate(-25deg); } 50% { transform: rotate(25deg); } }
    @keyframes lazy-walk-leg-r { 0%, 100% { transform: rotate(25deg); } 50% { transform: rotate(-25deg); } }
    @keyframes lazy-walk-arm-l { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } }
    @keyframes lazy-walk-arm-r { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
    
    .leg-l { animation: lazy-walk-leg-l 1s infinite ease-in-out; transform-origin: 0px 0px; }
    .leg-r { animation: lazy-walk-leg-r 1s infinite ease-in-out; transform-origin: 0px 0px; }
    .arm-l { animation: lazy-walk-arm-l 1s infinite ease-in-out; transform-origin: 0px 0px; }
    .arm-r { animation: lazy-walk-arm-r 1s infinite ease-in-out; transform-origin: 0px 0px; }

    @keyframes type-arm { 0%, 100% { transform: rotate(10deg); } 50% { transform: rotate(-15deg); } }
    .type-l { animation: type-arm 0.15s infinite; transform-origin: 0 0; }
    .type-r { animation: type-arm 0.12s infinite; transform-origin: 0 0; animation-delay: 0.05s; }
  `;

  // 1. Stickman Walk (Nodes 1 to 2, and 2 to 3)
  const StickWalk = ({ children }) => (
    <g transform="translate(0, -25)">
      {children}
      <circle cx="0" cy="-15" r="6" fill="#ea580c" />
      <line x1="0" y1="-9" x2="0" y2="10" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(0, -5)"><line className="arm-l" x1="0" y1="0" x2="0" y2="12" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" /></g>
      <g transform="translate(0, -5)"><line className="arm-r" x1="0" y1="0" x2="0" y2="12" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" /></g>
      <g transform="translate(0, 10)"><line className="leg-l" x1="0" y1="0" x2="0" y2="15" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" /></g>
      <g transform="translate(0, 10)"><line className="leg-r" x1="0" y1="0" x2="0" y2="15" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" /></g>
    </g>
  );

  // 2. Stickman Laptop (At Node 2)
  const StickLaptop = ({ children }) => (
    <g transform="translate(0, -25)">
      {children}
      <line x1="8" y1="10" x2="30" y2="10" stroke="#4b5563" strokeWidth="3" strokeLinecap="round" />
      <line x1="19" y1="10" x2="19" y2="25" stroke="#4b5563" strokeWidth="3" />
      <path d="M 10 10 L 14 -2 L 26 -2 L 22 10 Z" fill="#9ca3af" />
      <circle cx="-5" cy="-12" r="6" fill="#ea580c" />
      <line x1="-5" y1="-6" x2="-5" y2="10" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
      <line x1="-5" y1="10" x2="5" y2="10" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
      <line x1="5" y1="10" x2="5" y2="25" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(-5, -5)">
        <line className="type-l" x1="0" y1="0" x2="20" y2="12" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
        <line className="type-r" x1="0" y1="0" x2="22" y2="10" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </g>
  );

  // 3. Stickman to Goku SSJ Transform (At Node 3)
  const TransformGoku = ({ children }) => (
    <g transform="translate(0, -25)">
      {children}
      {/* 3.1. HAAAA! Speech Bubble (10.0s to 14.5s) */}
      <g>
        <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.4080; 0.4081; 0.5510; 0.5512; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        <g transform="translate(15, -45)">
          <path d="M -15 -10 C -25 -10, -25 5, -15 5 L -15 10 L -10 5 C 0 5, 0 -10, -15 -10 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="-18" y="1" fontSize="9" fontWeight="bold" fill="#ef4444" style={{ fontFamily: 'monospace' }}>HA!</text>
        </g>
      </g>

      {/* 10.0s-14.5s: Goku Transformation (Flickering Hair -> Golden SSJ + Aura) */}
      <g>
        <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.4080; 0.4081; 0.5510; 0.5512; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        
        {/* Flare (Flashes rapidly during the whole transformation) */}
        <g transform="translate(0, 7)">
          <g>
            <animate attributeName="opacity" values="1; 0; 1" dur="0.1s" repeatCount="indefinite" additive="sum" />
            <circle cx="0" cy="-15" r="25" fill="#fef08a" opacity="0.8" />
          </g>
        </g>
        
        {/* Aura & Lightning */}
        <g transform="translate(0, 7)">
          <g>
            <animateTransform attributeName="transform" type="scale" values="1,1; 1.4,1.4; 1,1" dur="0.2s" repeatCount="indefinite" />
            <ellipse cx="0" cy="-5" rx="15" ry="25" fill="#fef08a" opacity="0.6" style={{ filter: 'drop-shadow(0 0 15px #eab308)' }} />
          </g>
          <g>
            <animate attributeName="opacity" values="0; 1; 0; 0.8; 0" dur="0.3s" repeatCount="indefinite" />
            <path d="M -15 -10 L -10 5 L -18 0 L -12 15" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            <path d="M 12 -20 L 15 -5 L 8 -10 L 14 10" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
            <path d="M -5 -30 L 0 -15 L -8 -20 L 5 -5" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          </g>
        </g>
        
        {/* Goku Body Pose (Translated +7 to align feet to y=25) */}
        <g transform="translate(0, 7)">
          <g transform="translate(0, -22)">
            {/* Spiky Hair (Back) - Flickers Black to Golden */}
            <path d="M -6 2 L -14 -8 L -5 -6 L -8 -18 L 0 -12 L 8 -18 L 5 -6 L 14 -8 L 6 2 Z">
              <animate attributeName="fill" values="#111827; #111827; #eab308; #111827; #eab308; #111827; #eab308; #111827; #eab308; #111827; #eab308; #eab308" keyTimes="0; 0.4081; 0.4180; 0.4280; 0.4380; 0.4480; 0.4580; 0.4680; 0.4780; 0.4880; 0.4980; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
            </path>
            
            <circle cx="0" cy="0" r="5" fill="#fcd34d" /> 
            
            {/* Bangs (Front) - Flickers Black to Golden */}
            <path d="M -4 -2 L -6 4 L -1 -1 L 2 5 L 4 -2 Z">
              <animate attributeName="fill" values="#111827; #111827; #eab308; #111827; #eab308; #111827; #eab308; #111827; #eab308; #111827; #eab308; #eab308" keyTimes="0; 0.4081; 0.4180; 0.4280; 0.4380; 0.4480; 0.4580; 0.4680; 0.4780; 0.4880; 0.4980; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
            </path>
          </g>
          
          <path d="M -6 -15 L 6 -15 L 7 2 L -7 2 Z" fill="#f97316" />
          <path d="M 0 -15 L 4 -10 L 0 -5 L -4 -10 Z" fill="#1d4ed8" />
          <rect x="-7" y="0" width="14" height="3" fill="#1d4ed8" />
          
          {/* Blue Sleeves */}
          <path d="M -6 -15 L -10 -11 L -5 -9 Z" fill="#1d4ed8" />
          <path d="M 6 -15 L 10 -11 L 5 -9 Z" fill="#1d4ed8" />
          
          <g transform="translate(-4, 2)">
            <path d="M 0 0 L -8 10 L -4 10 L 4 0 Z" fill="#f97316" />
            <path d="M -8 10 L -4 10 L -2 16 L -10 16 Z" fill="#1d4ed8" />
          </g>
          <g transform="translate(4, 2)">
            <path d="M 0 0 L 8 10 L 4 10 L -4 0 Z" fill="#f97316" />
            <path d="M 8 10 L 4 10 L 2 16 L 10 16 Z" fill="#1d4ed8" />
          </g>
          
          {/* Left Arm (Power Up Pose) */}
          <g transform="translate(-6, -13)">
            <path d="M -1 0 L -8 6 L -9 14" fill="none" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="-9" cy="15" r="3" fill="#fcd34d" />
            <path d="M -11 14 C -12 16, -10 18, -8 16" fill="none" stroke="#d97706" strokeWidth="0.5" />
          </g>
          
          {/* Right Arm (Power Up Pose) */}
          <g transform="translate(6, -13)">
            <path d="M 1 0 L 8 6 L 9 14" fill="none" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="15" r="3" fill="#fcd34d" />
            <path d="M 11 14 C 12 16, 10 18, 8 16" fill="none" stroke="#d97706" strokeWidth="0.5" />
          </g>
        </g>
      </g>
    </g>
  );

  // 4. Goku SSJ Walk (Node 3 to Node 4)
  const GokuWalk = ({ children }) => (
    <g transform="translate(0, -18)">
      {children}
      <g>
        {/* Back Arm (Right Arm) - Behind the Body */}
        <g transform="translate(0, -12)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="30; -30; 30" dur="0.8s" repeatCount="indefinite" />
            <line x1="3" y1="0" x2="3" y2="12" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="3" cy="12" r="2.5" fill="#fcd34d" />
          </g>
        </g>

        <g transform="translate(0, -22)">
          {/* Authentic Spiky SSJ Hair (Back) */}
          <path d="M -6 2 L -14 -8 L -5 -6 L -8 -18 L 0 -12 L 8 -18 L 5 -6 L 14 -8 L 6 2 Z" fill="#eab308" />
          <circle cx="0" cy="0" r="5" fill="#fcd34d" /> 
          {/* Bangs (Front) */}
          <path d="M -4 -2 L -6 4 L -1 -1 L 2 5 L 4 -2 Z" fill="#eab308" />
        </g>
        
        {/* Torso matching the new style */}
        <path d="M -6 -15 L 6 -15 L 7 2 L -7 2 Z" fill="#f97316" />
        <path d="M 0 -15 L 4 -10 L 0 -5 L -4 -10 Z" fill="#1d4ed8" />
        <rect x="-7" y="0" width="14" height="3" fill="#1d4ed8" />
        
        {/* Blue Sleeves */}
        <path d="M -6 -15 L -10 -11 L -5 -9 Z" fill="#1d4ed8" />
        <path d="M 6 -15 L 10 -11 L 5 -9 Z" fill="#1d4ed8" />
        
        {/* Front Arm (Left Arm) - In Front of the Body */}
        <g transform="translate(0, -12)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-30; 30; -30" dur="0.8s" repeatCount="indefinite" />
            <line x1="-3" y1="0" x2="-3" y2="12" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="-3" cy="12" r="2.5" fill="#fcd34d" />
          </g>
        </g>
        
        <g transform="translate(0, 0)">
          <g className="leg-l">
            <path d="M -4 0 L 4 0 L 3 12 L -3 12 Z" fill="#f97316" />
            <path d="M -3 12 L 3 12 L 4 18 L -4 18 Z" fill="#1d4ed8" />
            <rect x="-3.5" y="12" width="6" height="2" fill="#ef4444" />
          </g>
          <g className="leg-r">
            <path d="M -4 0 L 4 0 L 3 12 L -3 12 Z" fill="#f97316" />
            <path d="M -3 12 L 3 12 L 4 18 L -4 18 Z" fill="#1d4ed8" />
            <rect x="-3.5" y="12" width="6" height="2" fill="#ef4444" />
          </g>
        </g>
      </g>
    </g>
  );

  // 5. Naruto Transform (At Node 4)
  const NarutoTransform = ({ children }) => (
    <g transform="translate(0, -18)">
      {children}

      {/* 1. NARUTO BODY */}
      <g>
        {/* Naruto Side-Profile (Look Left / Look Right) 18.0s to 19.5s */}
        <g>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.7346; 0.7347; 0.7959; 0.796; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="scale" values="1,1; 1,1; -1,1; -1,1; 1,1; 1,1" keyTimes="0; 0.7549; 0.755; 0.7753; 0.7755; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
          <g transform="translate(0, -22)">
            <path d="M -6 -2 L -12 2 L -8 -6 L -14 -10 L -6 -12 L -10 -18 L 0 -14 L 4 -20 L 6 -12 L 12 -12 L 8 -4 Z" fill="#fde047" />
            <circle cx="0" cy="0" r="5" fill="#fed7aa" /> 
            <path d="M -5 -4 Q 0 -5 5 -4 L 5 0 Q 0 -1 -5 0 Z" fill="#111827" />
            <rect x="0" y="-3.5" width="4" height="2.5" fill="#9ca3af" rx="0.5" />
            <circle cx="1" cy="-2.25" r="0.4" fill="#111827" />
            <circle cx="3" cy="-2.25" r="0.4" fill="#111827" />
            <circle cx="2.5" cy="-0.5" r="0.6" fill="#111827" />
            <line x1="1" y1="1" x2="4" y2="0.5" stroke="#111827" strokeWidth="0.4" />
            <line x1="1" y1="2" x2="4" y2="2" stroke="#111827" strokeWidth="0.4" />
            <line x1="1" y1="3" x2="4" y2="3.5" stroke="#111827" strokeWidth="0.4" />
          </g>
          <path d="M -5 -15 L 5 -15 L 6 0 L -6 0 Z" fill="#f97316" />
          <path d="M -5 -15 L 0 -5 L 5 -15 Z" fill="#111827" />
          <rect x="-6" y="-2" width="12" height="3" fill="#111827" />
          <g transform="translate(0, 0)">
            <path d="M -4 0 L 4 0 L 3 12 L -3 12 Z" fill="#f97316" />
            <path d="M -3 12 L 3 12 L 4 18 L -4 18 Z" fill="#111827" />
          </g>
        </g>

        {/* Naruto Front-Profile (Middle/Jutsu) 19.5s to 20.0s */}
        <g>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.7958; 0.7959; 0.8162; 0.8164; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
          <g transform="translate(0, -22)">
            <path d="M -10 2 L -15 -5 L -8 -10 L -12 -18 L -4 -15 L 0 -22 L 4 -15 L 12 -18 L 8 -10 L 15 -5 L 10 2 Z" fill="#fde047" />
            <circle cx="0" cy="0" r="5" fill="#fed7aa" /> 
            <rect x="-8" y="-4" width="16" height="4" fill="#111827" />
            <rect x="-4" y="-3.5" width="8" height="3" fill="#9ca3af" rx="1" />
            <circle cx="-2" cy="-2" r="0.5" fill="#111827" />
            <circle cx="2" cy="-2" r="0.5" fill="#111827" />
            <circle cx="-2" cy="0" r="0.6" fill="#111827" />
            <circle cx="2" cy="0" r="0.6" fill="#111827" />
            <line x1="-5" y1="1" x2="-3" y2="1.5" stroke="#111827" strokeWidth="0.4" />
            <line x1="-5" y1="2" x2="-3" y2="2" stroke="#111827" strokeWidth="0.4" />
            <line x1="5" y1="1" x2="3" y2="1.5" stroke="#111827" strokeWidth="0.4" />
            <line x1="5" y1="2" x2="3" y2="2" stroke="#111827" strokeWidth="0.4" />
          </g>
          <path d="M -5 -15 L 5 -15 L 6 0 L -6 0 Z" fill="#f97316" />
          <path d="M -5 -15 L 0 -5 L 5 -15 Z" fill="#111827" />
          <rect x="-6" y="-2" width="12" height="3" fill="#111827" />
          <g transform="translate(0, 0)">
            <path d="M -4 0 L 4 0 L 3 12 L -3 12 Z" fill="#f97316" />
            <path d="M -3 12 L 3 12 L 4 18 L -4 18 Z" fill="#111827" />
          </g>
          
          {/* Hand Signs (Rapid Arms) */}
          <g>
            <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.7958; 0.7959; 0.8162; 0.8164; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="0.1s" repeatCount="indefinite" />
              <path d="M -6 -10 L 0 -14 L 6 -10" fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M -4 -8 L 0 -12 L 4 -8" fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M -5 -6 L 0 -10 L 5 -6" fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </g>

      {/* 2. FLYING SHURIKENS (18.5s to 20.0s) */}
      <g>
        {/* Left Shuriken (Starts at 18.5s, Hits at 20.0s) */}
        <g>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.7549; 0.755; 0.8162; 0.8164; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="-350,-15; -350,-15; -15,0; -15,0" keyTimes="0; 0.755; 0.8162; 1" dur="24.5s" repeatCount="indefinite" additive="sum" />
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0; 2160" dur="0.4s" repeatCount="indefinite" additive="sum" />
            <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#64748b" />
            <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
          </g>
        </g>

        {/* Right Shuriken (Starts at 19.0s, Hits at 20.0s) */}
        <g>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.7753; 0.7755; 0.8162; 0.8164; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="350,-25; 350,-25; 15,-5; 15,-5" keyTimes="0; 0.7755; 0.8162; 1" dur="24.5s" repeatCount="indefinite" additive="sum" />
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0; -2160" dur="0.4s" repeatCount="indefinite" additive="sum" />
            <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#64748b" />
            <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
          </g>
        </g>
      </g>

      {/* 3. LIGHT GREY PUFFY SMOKE (20.0s to 21.5s) */}
      <g transform="translate(0, -10)">
        <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.8161; 0.8162; 0.8571; 0.8775; 1" calcMode="linear" dur="24.5s" repeatCount="indefinite" />
        <g>
          <animateTransform attributeName="transform" type="scale" values="0,0; 0,0; 1.5,1.5; 2.5,2.5; 2.5,2.5" keyTimes="0; 0.8162; 0.8244; 0.8775; 1" dur="24.5s" repeatCount="indefinite" />
          <path d="M -5 5 C -15 15, -25 -5, -10 -10 C -15 -25, 5 -30, 10 -15 C 25 -20, 25 5, 10 10 C 15 20, -5 20, -5 5 Z" fill="#e2e8f0" opacity="0.95" />
          <path d="M 0 0 C -10 10, -20 -10, -5 -15 C -10 -20, 10 -25, 15 -10 C 20 -15, 20 10, 5 15 C 10 20, 0 20, 0 0 Z" fill="#f1f5f9" opacity="0.95" />
          <path d="M -2 2 C -8 8, -15 -5, -3 -10 C -8 -15, 8 -20, 10 -5 C 15 -10, 15 8, 3 10 C 8 15, -2 15, -2 2 Z" fill="#f8fafc" opacity="0.95" />
        </g>
      </g>

      {/* 4. TREE TRUNK + STUCK SHURIKENS (Appears as smoke fades, splits later) */}
      <g transform="translate(0, -10)">
        <animate attributeName="opacity" values="0; 0; 1; 1" keyTimes="0; 0.8570; 0.8571; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        
        {/* Scale up from center (in sync with smoke disappearing: 0.8571 to 0.8775) */}
        <g>
          <animateTransform attributeName="transform" type="scale" values="0,0; 0,0; 1,1; 1,1" keyTimes="0; 0.8571; 0.8775; 1" dur="24.5s" repeatCount="indefinite" />
          
          {/* Left Trunk Half + Stuck Left Shuriken (Splits at 22.0s to 23.0s) */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0,-10,15; 0,-10,15; -90,-10,15; -90,-10,15" keyTimes="0; 0.8979; 0.9387; 1" dur="24.5s" repeatCount="indefinite" additive="sum" />
            <path d="M -10 -15 L 0 -15 L -2 0 L 2 5 L -10 15 Z" fill="#78350f" />
            <path d="M 0 -15 C 2 -15, 4 -12, 4 -8 C 4 -4, 2 -2, 0 0 L -2 0 Z" fill="#fcd34d" opacity="0.8" />
            <line x1="-7" y1="-10" x2="-7" y2="10" stroke="#451a03" strokeWidth="1" />
            
            <g transform="translate(-10, 0) rotate(-15)">
              <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#64748b" />
              <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
            </g>
          </g>

          {/* Right Trunk Half + Stuck Right Shuriken (Splits at 22.0s to 23.0s) */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0,10,15; 0,10,15; 90,10,15; 90,10,15" keyTimes="0; 0.8979; 0.9387; 1" dur="24.5s" repeatCount="indefinite" additive="sum" />
            <path d="M 0 -15 L 10 -15 L 10 15 L 2 5 L -2 0 Z" fill="#78350f" />
            <path d="M -2 0 C 0 -2, 2 -4, 2 -8 C 2 -12, 0 -15, 0 -15 Z" fill="#fcd34d" opacity="0.8" />
            <line x1="7" y1="-10" x2="7" y2="10" stroke="#451a03" strokeWidth="1" />

            <g transform="translate(10, -5) rotate(45)">
              <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#64748b" />
              <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
            </g>
          </g>
        </g>
      </g>

      {/* 5. Exclamation Mark (!) Speech Bubble - 18.1s to 18.5s */}
      <g>
        <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.7386; 0.7387; 0.755; 0.7551; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        <g transform="translate(0, -45)">
          <g>
            <animateTransform attributeName="transform" type="scale" values="0,0; 1,1; 1,1; 0,0" keyTimes="0; 0.7387; 0.7469; 0.7543; 1" dur="24.5s" repeatCount="indefinite" />
            
            {/* White Bubble with shadow */}
            <circle cx="0" cy="-5" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M -4 5 L 0 12 L 4 5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M -4 5 L 4 5" fill="#ffffff" /> {/* Hide bottom stroke of circle */}
            
            {/* Red Exclamation inside bubble */}
            {/* Red Exclamation inside bubble */}
            <line x1="0" y1="-10" x2="0" y2="-3" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="1" r="1.5" fill="#ef4444" />
          </g>
        </g>
      </g>
    </g>
  );

  const MasterActor = ({ path }) => (
    <g>
      <g>
        <animateTransform attributeName="transform" type="scale" values="1,1; 1,1; -1,1; -1,1; 1,1; 1,1" keyTimes="0; 0.4081; 0.4082; 0.6122; 0.6124; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        
        <StickWalk>
          <animate attributeName="opacity" values="1; 1; 0; 0; 1; 1; 0; 0" keyTimes="0; 0.204; 0.2041; 0.2857; 0.2858; 0.4081; 0.4082; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        </StickWalk>

        <StickLaptop>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.2039; 0.204; 0.2857; 0.2858; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        </StickLaptop>

        <TransformGoku>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.4080; 0.4081; 0.5510; 0.5512; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        </TransformGoku>

        <GokuWalk>
          <animate attributeName="opacity" values="0; 0; 1; 1; 0; 0" keyTimes="0; 0.5509; 0.5510; 0.7347; 0.7348; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        </GokuWalk>

        <NarutoTransform>
          <animate attributeName="opacity" values="0; 0; 1; 1" keyTimes="0; 0.7346; 0.7347; 1" calcMode="discrete" dur="24.5s" repeatCount="indefinite" />
        </NarutoTransform>
      </g>
      <animateMotion
        dur="24.5s"
        repeatCount="indefinite"
        calcMode="linear"
        keyTimes="0; 0.0816; 0.204; 0.2857; 0.4081; 0.5510; 0.7347; 1"
        keyPoints="0; 0; 0.306; 0.306; 0.699; 0.699; 1; 1"
        path={path}
      />
    </g>
  );

  const desktopPath = "M 350 150 C 350 50, 850 50, 850 150 C 850 325, 350 325, 350 500 C 350 600, 830 600, 830 500";

  const TextCard = ({ item }) => (
    <div className="bg-white/95 dark:bg-gray-800/95 p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-left relative z-10 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5 flex items-baseline">
        {item.title} <span className="text-orange-600 dark:text-orange-400 text-sm tracking-wider uppercase ml-3 font-bold">- {item.date}</span>
      </h3>
      <h4 className="text-base text-gray-500 dark:text-gray-400 mb-2 font-medium">{item.company}</h4>
      <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{item.description}</p>
    </div>
  );

  return (
    <section className="hidden lg:block py-24 px-6 overflow-hidden bg-gray-50 dark:bg-gray-900/50">
      <style>{animationStyles}</style>
      <div className="max-w-7xl mx-auto">
        <m.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 mb-16 text-center"
        >
          My Journey
        </m.h2>
        
        <div className="relative w-full h-[650px] max-w-6xl mx-auto hidden lg:block">
          
          <svg className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid meet">
            <path
              d={desktopPath}
              fill="none"
              stroke="currentColor"
              className="text-orange-300 dark:text-orange-500/50"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 16"
            />
            {/* The nodes are perfectly positioned at (350, 150), (850, 150), (350, 500), (850, 500) */}
            <circle cx="350" cy="150" r="8" fill="#ea580c" />
            <circle cx="850" cy="150" r="8" fill="#ea580c" />
            <circle cx="350" cy="500" r="8" fill="#ea580c" />
            <circle cx="830" cy="500" r="8" fill="#ea580c" />
            <MasterActor path={desktopPath} />
          </svg>

          {/* Text Boxes explicitly pushed into the Left and Right gutters using percentages to guarantee NO overlap */}
          <div className="absolute transform -translate-y-1/2" style={{ left: '1%', width: '23%', top: '18.75%' }}>
            <TextCard item={milestones[0]} />
          </div>
          <div className="absolute transform -translate-y-1/2" style={{ right: '1%', width: '23%', top: '18.75%' }}>
            <TextCard item={milestones[1]} />
          </div>
          <div className="absolute transform -translate-y-1/2" style={{ left: '1%', width: '23%', top: '62.5%' }}>
            <TextCard item={milestones[2]} />
          </div>
          <div className="absolute transform -translate-y-1/2" style={{ right: '1%', width: '23%', top: '62.5%' }}>
            <TextCard item={milestones[3]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
