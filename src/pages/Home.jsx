import {  m, useMotionValue, useTransform, animate, useScroll, AnimatePresence  } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useRef, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ReviewFormModal from '../components/ReviewFormModal';
import JourneyTimeline from '../components/JourneyTimeline';
import FreelanceServices from '../components/FreelanceServices';
import CallToAction from '../components/CallToAction';

const GoogleTagIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.17 12.83C48.73 11.27 51.27 11.27 52.83 12.83L78 38V80C78 85.52 73.52 90 68 90H32C26.48 90 22 85.52 22 80V38L47.17 12.83Z" fill="#4285F4"/>
    <circle cx="50" cy="30" r="5" fill="white"/>
    <path d="M66.4,60.2 C66.4,58.7 66.3,57.3 66.0,55.9 H50.0 V63.6 H59.2 C58.8,66.2 57.3,68.3 55.1,69.8 V74.6 H60.6 C63.8,71.6 66.4,66.3 66.4,60.2 Z" fill="white"/>
    <path d="M50.0,76.9 C54.6,76.9 58.5,75.4 60.6,72.7 L55.1,67.9 C53.6,68.9 51.9,69.5 50.0,69.5 C46.3,69.5 43.1,67.0 42.0,63.6 H36.3 V68.6 C38.8,73.6 44.0,76.9 50.0,76.9 Z" fill="white"/>
    <path d="M42.0,63.6 C41.7,62.4 41.5,61.2 41.5,60.0 C41.5,58.7 41.7,57.5 42.0,56.4 V51.4 H36.3 C35.2,53.6 34.6,56.0 34.6,58.5 C34.6,61.0 35.2,63.5 36.3,65.7 L42.0,63.6 Z" fill="white"/>
    <path d="M50.0,50.5 C52.5,50.5 54.7,51.4 56.5,53.1 L61.3,48.3 C58.5,45.7 54.6,44.1 50.0,44.1 C44.0,44.1 38.8,47.4 36.3,52.4 L42.0,57.4 C43.1,54.0 46.3,50.5 50.0,50.5 Z" fill="white"/>
  </svg>
);

const DragRotateLogo = ({ children }) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handlePan = (event, info) => {
    rotateY.set(rotateY.get() + info.delta.x * 0.2);
    rotateX.set(rotateX.get() - info.delta.y * 0.2);
  };

  const handlePanEnd = () => {
    animate(rotateX, 0, { type: "spring", stiffness: 60, damping: 15 });
    animate(rotateY, 0, { type: "spring", stiffness: 60, damping: 15 });
  };

  return (
    <div className="w-full aspect-video flex items-center justify-center perspective-1000">
      <m.div
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{
          rotateX,
          rotateY,
          cursor: "grab",
          transformStyle: "preserve-3d"
        }}
        whileTap={{ cursor: "grabbing" }}
        className="relative flex items-center justify-center p-8 select-none"
      >
        <div style={{ transform: "translateZ(50px)" }} className="pointer-events-none drop-shadow-2xl flex items-center justify-center">
          {children}
        </div>
      </m.div>
    </div>
  );
};

const CognizantLogo = () => (
  <svg viewBox="0 0 350 80" className="w-64 md:w-80" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="60" fontFamily="'Inter', Arial, sans-serif" fontSize="64" fontWeight="800" fill="#000048" className="dark:fill-white">Cognizant</text>
  </svg>
);

const HclLogo = () => (
  <svg viewBox="0 0 320 80" className="w-64 md:w-80" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="65" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="900" fontStyle="italic" fill="#005FA7" transform="skewX(-15) translate(15,0)">HCL</text>
  </svg>
);

const TerminalWindow = () => {
  return (
    <m.div 
      initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="w-full max-w-lg mx-auto bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 text-left perspective-1000"
    >
      <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="ml-4 text-xs text-gray-500 font-mono flex-1 text-center pr-12">bash - root@karthik-analytics ~</span>
      </div>
      <div className="p-4 sm:p-6 text-sm sm:text-base font-mono text-green-400 h-64 overflow-y-auto">
        <TypeAnimation
          sequence={[
            'karthik@analytics ~ % node init_tracking.js\n\n[OK] Server-Side GTM Connected.\n[OK] BigQuery Stream Active.\n\nconst trackEvent = (name, data) => {\n  dataLayer.push({\n    event: name,\n    ...data\n  });\n};\n\ntrackEvent("conversion", { value: 250 });\n\n> Sending hit to GA4... 200 OK',
            5000,
            ''
          ]}
          wrapper="pre"
          cursor={true}
          repeat={Infinity}
          style={{ whiteSpace: 'pre-wrap', display: 'block' }}
        />
      </div>
    </m.div>
  );
};

const Home = () => {
  const skills = [
    { icon: 'logos:google-analytics', name: 'GA4', desc: 'Google Analytics 4' },
    { icon: 'logos:google-tag-manager', name: 'GTM', desc: 'Google Tag Manager' },
    { icon: 'mdi:server', name: 'Server-Side GTM', desc: 'Advanced Tracking' },
    { icon: 'logos:google-ads', name: 'Google Ads', desc: 'Digital Ad Platform' },
    { icon: 'hugeicons:shield-02', name: 'Consent Mode V2', desc: 'GDPR Compliance' },
    { icon: 'custom:google-tag', name: 'Google Tag Gateway', desc: 'First-Party Data' },
    { icon: 'custom:bigquery', name: 'BigQuery', desc: 'Data Analysis' },
    { icon: 'logos:looker-icon', name: 'Looker Studio', desc: 'Data Visualization' },
    { icon: 'logos:google-marketing-platform', name: 'CM360 & SA360', desc: 'Marketing Platform' },
    { icon: ['logos:salesforce', 'logos:hubspot'], name: 'CRM Integration', desc: 'Customer Relationship Management' },
  ];

  const testimonials = [
    {
      name: 'Jane Doe',
      role: 'CEO, TechNova',
      quote: "Karthik's lead generation strategy boosted our pipeline by 200% in just two quarters. Unbelievable results!",
      full: "Working with Karthik transformed our entire marketing approach. His deep understanding of GTM and GA4 allowed us to track every interaction and optimize our campaigns in real-time. The 200% pipeline increase was just the beginning - our conversion rates improved by 45% and our cost per acquisition dropped significantly."
    },
    {
      name: 'Mark Johnson',
      role: 'Founder, StyleUp',
      quote: "He completely transformed our e-commerce site, solving a huge abandonment issue with a clever A/B test.",
      full: "Our cart abandonment rate was at 78% before Karthik stepped in. Through meticulous A/B testing and conversion rate optimization, he identified the friction points and implemented solutions that brought our abandonment rate down to 32%. The revenue impact was immediate and substantial."
    },
    {
      name: 'Michael Ross',
      role: 'Marketing Dir, GreenLife',
      quote: "SEO traffic tripled in 6 months. His technical knowledge of Schema markup is unmatched.",
      full: "Karthik's technical SEO expertise is exceptional. He implemented comprehensive Schema markup across our site, optimized our Core Web Vitals, and restructured our content strategy. The result? Organic traffic increased by 300% in just 6 months, and we now rank on page 1 for our target keywords."
    },
    {
      name: 'Emily Blunt',
      role: 'Head of Comms, FinTech',
      quote: "Our brand visibility soared after his Facebook and Instagram ad restructuring. The ROI speaks for itself.",
      full: "The paid media overhaul Karthik delivered was phenomenal. He restructured our entire Facebook and Instagram ad strategy, implemented advanced tracking, and optimized our creative approach. Our ROAS improved from 2.5x to 6.8x, and brand awareness metrics reached all-time highs."
    },
    {
      name: 'David Lee',
      role: 'E-commerce Manager, GearZone',
      quote: "A master of Google Ads automation. He took a $10k/month budget and scaled us to $50k/month profitably.",
      full: "Karthik's Google Ads automation skills are unmatched. He built sophisticated automated bidding strategies, implemented smart campaign structures, and used advanced scripts to optimize performance. We scaled from $10k to $50k monthly spend while maintaining and improving our ROAS throughout."
    },
    {
      name: 'Sarah Chen',
      role: 'CTO, DataFlow',
      quote: "His implementation of Server-Side GTM revolutionized our data collection. We now have 99.9% data accuracy.",
      full: "Before Karthik, we were losing 30% of our conversion data due to ad blockers and browser restrictions. His Server-Side GTM implementation solved this completely. We now have 99.9% data accuracy, which has transformed our attribution modeling and ROI calculations."
    },
    {
      name: 'Robert Williams',
      role: 'VP Marketing, RetailMax',
      quote: "The consent mode implementation was flawless. Zero compliance issues and 40% better conversion tracking.",
      full: "GDPR compliance was a nightmare for us until Karthik stepped in. His Consent Mode V2 implementation was flawless - we passed every audit with flying colors. Plus, our conversion tracking improved by 40% compared to our previous setup."
    },
    {
      name: 'Lisa Park',
      role: 'Director, GrowthHub',
      quote: "BigQuery integration gave us insights we never knew existed. Our data-driven decisions increased revenue by 150%.",
      full: "Karthik's BigQuery integration work was transformative. He built custom dashboards that revealed insights we never knew existed. Our data-driven decision-making process increased revenue by 150% in the first year alone."
    },
    {
      name: 'James Miller',
      role: 'Founder, StartupX',
      quote: "From zero to hero - he built our entire analytics infrastructure from scratch in just 3 weeks.",
      full: "As a startup, we had no analytics infrastructure. Karthik built everything from scratch - GA4, GTM, custom events, conversion tracking, and attribution modeling - all in just 3 weeks. We went from zero data to having complete visibility into our funnel."
    }
  ];

  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDynamicTestimonials(data);
        }
      })
      .catch(console.error);
  }, []);

  const allTestimonials = [...dynamicTestimonials, ...testimonials];
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(allTestimonials.length / testimonialsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 15000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentTestimonials = allTestimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  const { scrollY } = useScroll();
  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -300]);
  const parallaxY2 = useTransform(scrollY, [0, 1000], [0, 200]);
  const parallaxY3 = useTransform(scrollY, [0, 1000], [0, -150]);
  const parallaxRotate = useTransform(scrollY, [0, 1000], [0, 90]);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Scroll-Driven Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <m.div style={{ y: parallaxY1 }} className="absolute top-0 -left-32 w-[30rem] h-[30rem] bg-orange-500/5 dark:bg-blue-500/5 rounded-full blur-[100px]"></m.div>
        <m.div style={{ y: parallaxY2 }} className="absolute top-[40vh] -right-32 w-[40rem] h-[40rem] bg-blue-500/5 dark:bg-orange-500/5 rounded-full blur-[120px]"></m.div>
        
        {/* Highly Visible Geometric Parallax Shapes */}
        <m.div style={{ y: parallaxY1, rotate: parallaxRotate }} className="absolute top-[15vh] right-[10vw] w-20 h-20 border-[8px] border-orange-500/20 dark:border-blue-500/20 rounded-xl"></m.div>
        <m.div style={{ y: parallaxY2, rotate: parallaxRotate }} className="absolute top-[45vh] left-[5vw] w-12 h-12 border-4 border-blue-500/20 dark:border-orange-500/20 rounded-full"></m.div>
        <m.div style={{ y: parallaxY3, rotate: parallaxRotate }} className="absolute top-[75vh] right-[20vw] w-16 h-16 border-4 border-indigo-500/20 rounded-lg"></m.div>
      </div>

      <section className="min-h-[90vh] flex items-center justify-center px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
          
          <div className="relative z-10 space-y-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-orange-600 dark:text-orange-400 font-medium text-lg tracking-wide uppercase">
                Hello, I'm Karthik
              </span>
            </m.div>

            <m.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Measurement & Analytics
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 dark:from-blue-400 dark:to-blue-600">
                SME Team Lead
              </span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
            >
              5+ years delivering enterprise-scale analytics, tagging, privacy, and attribution solutions. Specialized in GA4, Google Tag Manager, Server-Side GTM, Google Ads Conversion Tracking, Enhanced Conversions, and GDPR compliance.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <Link
                to="/contact"
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-blue-500/25"
              >
                Get In Touch
                <Icon icon="hugeicons:arrow-right-02" className="w-5 h-5" />
              </Link>
              <Link
                to="/works"
                className="px-8 py-4 border-2 border-orange-600 dark:border-blue-600 text-orange-600 dark:text-blue-400 hover:bg-orange-50 dark:hover:bg-blue-900/20 font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center"
              >
                View My Experience
              </Link>
            </m.div>
          </div>

          <div className="relative z-10 lg:pl-12 perspective-1000 hidden sm:block">
            <TerminalWindow />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
            >
              Technologies I Expertise In
            </m.h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {skills.map((skill, index) => (
              <m.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                {Array.isArray(skill.icon) ? (
                  <div className="flex justify-center items-center gap-3 mb-3 md:mb-4 h-10 md:h-12">
                    {skill.icon.map((icn, idx) => (
                      <Icon key={idx} icon={icn} className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" style={{ color: icn.startsWith('logos:') ? 'unset' : undefined }} />
                    ))}
                  </div>
                ) : skill.icon === 'custom:google-tag' ? (
                  <GoogleTagIcon className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform" />
                ) : skill.icon === 'custom:bigquery' ? (
                  <img src="/bigquery.svg" className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform drop-shadow-md" alt="BigQuery" />
                ) : (
                  <Icon icon={skill.icon} className="w-10 h-10 md:w-12 md:h-12 text-orange-600 dark:text-orange-400 mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform" style={{ color: skill.icon.startsWith('logos:') ? 'unset' : undefined }} />
                )}
                <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-white text-center mb-1 md:mb-2">
                  {skill.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                  {skill.desc}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-orange-50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            Professional Profile
          </m.h2>

          <div className="grid lg:grid-cols-3 gap-8">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl border border-orange-100 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-6 flex items-center gap-3">
                <Icon icon="hugeicons:target-02" className="w-8 h-8" />
                Summary
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Measurement & Analytics SME Team Lead with 5+ years of experience delivering enterprise-scale analytics, tagging, privacy, and attribution solutions. Specialized in GA4, Google Tag Manager, Server-Side GTM, Google Ads Conversion Tracking, Enhanced Conversions, Offline Conversion Tracking, Consent Mode V2, GDPR compliance, and Google Tag Gateway.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Supported 5,000+ measurement implementations and 2,000+ advertisers globally while partnering with Google teams to improve data quality, attribution accuracy, and bidding performance.
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl border border-orange-100 dark:border-gray-700 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-6 flex items-center gap-3">
                  <Icon icon="mdi:school" className="w-8 h-8" />
                  Education
                </h3>
                <div className="mb-8">
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">Bachelor of Engineering</p>
                  <p className="text-orange-600 dark:text-orange-400 font-medium mb-2">Electronics & Communication</p>
                  <p className="text-gray-600 dark:text-gray-400">Matrusri Engineering College</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-3">
                  <Icon icon="hugeicons:translate" className="w-6 h-6" />
                  Languages
                </h3>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">English</span>
                    <span className="text-sm">Professional</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Telugu</span>
                    <span className="text-sm">Professional</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Tamil</span>
                    <span className="text-sm">Native</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">Hindi</span>
                    <span className="text-sm">Conversational</span>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
          >
            Professional Experience
          </m.h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-orange-300 dark:before:via-blue-800 before:to-transparent">
            
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-orange-600 dark:bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Icon icon="hugeicons:user-multiple" className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-orange-50 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-white">Cognizant (Client: Google)</h3>
                  <span className="px-4 py-1.5 bg-orange-100 dark:bg-blue-900/40 text-orange-700 dark:text-blue-300 rounded-full text-sm font-semibold tracking-wide w-fit">2023 - Present</span>
                </div>
                <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-6">Measurement - SME Team Lead</h4>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Enterprise Measurement Strategy & Team Leadership:</span> Led end-to-end measurement strategy across global advertisers, managing and mentoring a team of SMEs to resolve complex product issues and uphold implementation quality standards.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">GA4 Architecture & Advanced Configuration:</span> Designed scalable GA4 event frameworks and data layer architectures tailored to client needs, encompassing custom reports, conversion funnels, e-commerce tracking, and CRM tool integrations.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">GTM (Client & Server-Side Deployments):</span> Implemented and debugged GTM containers across environments, covering GA4 tags, Google Ads, Meta Pixel, custom HTML tags, community templates, and third-party tracking integrations.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Consent Mode V2 & GDPR-Compliant Measurement:</span> Designed and deployed Consent Mode V2 solutions to help clients maintain global privacy compliance and accurate, consent-aware data collection without compromising measurement.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Google Ads Conversion Tracking & Enhanced Conversions:</span> Configured conversion tracking, Enhanced Conversions, and Offline Conversion Tracking via GADM, with CRM integrations including CallRail, HubSpot, Salesforce, and Zoho.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Google Tag Gateway & First-Party Data Frameworks:</span> Implemented Google Tag Gateway (GTG) solutions by integrating with leading CDNs (Akamai, Cloudflare, Fastly, Amazon CloudFront) to enable robust first-party data collection.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">CM360, SA360 & Cross-Platform Attribution:</span> Configured Floodlight tags within CM360 and SA360 to support cross-platform attribution analysis and bridge data discrepancies across channels.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Attribution Modelling & Data-Driven Insights:</span> Evaluated and optimised Google Attribution Models (including DDA and Last-Click) to inform smarter bidding strategies and improve reporting accuracy.
                  </p>
                </div>
              </div>
              
              <div className="absolute hidden md:flex top-1/2 -translate-y-1/2 w-[calc(50%-4rem)] group-even:right-0 group-odd:left-0 items-center justify-center">
                <DragRotateLogo>
                  <img src="/cognizant_real.svg" alt="Cognizant" className="w-64 md:w-80" />
                </DragRotateLogo>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-orange-600 dark:bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Icon icon="hugeicons:settings-01" className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 md:p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-orange-50 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-white">HCL Technologies</h3>
                  <span className="px-4 py-1.5 bg-orange-100 dark:bg-blue-900/40 text-orange-700 dark:text-blue-300 rounded-full text-sm font-semibold tracking-wide w-fit">2019 - 2023</span>
                </div>
                <h4 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-6">Senior Analyst</h4>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">B2B Technical Support & Incident Management:</span> Delivered comprehensive B2B technical support, managing incident classification, documentation, and end-to-end resolution of complex software and hardware issues via remote diagnostic tools.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Hardware & Device Management:</span> Engineered and managed deployment and troubleshooting protocols for enterprise devices, ensuring seamless operation across macOS, iOS (iPhone/iPad), and Windows ecosystems.
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">Enterprise Asset & Database Operations:</span> Managed Digital Asset Management platforms (Veeva Vault) and provided foundational database support via SQL, maintaining high data integrity and availability.
                  </p>
                </div>
              </div>
              
              <div className="absolute hidden md:flex top-1/2 -translate-y-1/2 w-[calc(50%-4rem)] group-even:right-0 group-odd:left-0 items-center justify-center">
                <DragRotateLogo>
                  <HclLogo />
                </DragRotateLogo>
              </div>
            </m.div>

          </div>
        </div>
      </section>

      <JourneyTimeline />
      <FreelanceServices />

      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-orange-50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 md:mb-16"
          >
            What People Say About Working With Me
          </m.h2>

          <div className="relative">
            <m.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {currentTestimonials.map((testimonial, index) => (
                <TestimonialCard key={currentPage * testimonialsPerPage + index} testimonial={testimonial} index={index} onExpand={setExpandedTestimonial} />
              ))}
            </m.div>

            {/* Pagination controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
                className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalPages <= 1}
              >
                <Icon icon="hugeicons:arrow-left-01" className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentPage === index
                        ? 'bg-orange-600 dark:bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
                className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalPages <= 1}
              >
                <Icon icon="hugeicons:arrow-right-01" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-8 flex justify-end pr-4 sm:pr-8">
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium flex items-center gap-2 hover:underline transition-all"
              >
                Want to say something <Icon icon="hugeicons:arrow-right-02" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
      <ReviewFormModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      
      <AnimatePresence>
        {expandedTestimonial && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setExpandedTestimonial(null)}
          >
            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Client Review</h3>
                <button
                  onClick={() => setExpandedTestimonial(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Icon icon="hugeicons:cancel-01" className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0">
                  <img 
                    src={expandedTestimonial.imagePath || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expandedTestimonial.name.replace(/\s/g, '')}`} 
                    alt={expandedTestimonial.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{expandedTestimonial.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{expandedTestimonial.role}</p>
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                "{expandedTestimonial.full}"
              </p>

              <button
                onClick={() => setExpandedTestimonial(null)}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TestimonialCard = ({ testimonial, index, onExpand }) => {
  const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name.replace(/\s/g, '')}`;
  const avatar = testimonial.imagePath || randomAvatar;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 dark:bg-black/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-white/20 dark:border-white/10"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0">
          <img src={avatar} alt={testimonial.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>

      <button
        onClick={() => onExpand(testimonial)}
        className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
      >
        Read More
      </button>
    </m.div>
  );
};

export default Home;
