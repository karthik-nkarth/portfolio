import { m, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

const Works = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const websites = [
    {
      image: '/pracy_logo.png',
      title: 'Pracy',
      platform: 'Shopify',
      url: 'https://www.pracy.in/',
      description: 'E-commerce website built on Shopify with custom theme development and payment integration.',
      category: 'E-commerce'
    },
    {
      image: 'https://www.google.com/s2/favicons?domain=autocraftmelbourne.com.au&sz=128',
      title: 'Autocraft Melbourne',
      platform: 'Wix',
      url: 'https://www.autocraftmelbourne.com.au/',
      description: 'Automotive services website built on Wix with custom design and booking system.',
      category: 'Business'
    },
    {
      image: '/healsway_logo.jpg',
      title: 'Healsway',
      platform: 'Shopify',
      url: 'https://healsway.io/',
      description: 'Premium provider of luxurious wooden carved furniture, accessories, and sculptures with impeccable craftsmanship.',
      category: 'E-commerce'
    },
    {
      image: 'https://www.google.com/s2/favicons?domain=australianhypnotherapycentre.com.au&sz=128',
      title: 'Australian Hypnotherapy',
      platform: 'WordPress',
      url: 'https://australianhypnotherapycentre.com.au/',
      description: 'Professional hypnotherapy services platform with custom service pages and booking workflows.',
      category: 'Health'
    },
    {
      image: 'https://www.google.com/s2/favicons?domain=noatune.com&sz=128',
      title: 'Noatune',
      platform: 'Webflow',
      url: 'https://noatune.com/',
      description: 'Modern and sleek website for recording studios with interactive gallery and booking capabilities.',
      category: 'Sound Studio'
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(websites.length / itemsPerPage);
  
  useEffect(() => {
    if (totalPages > 1) {
      const interval = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [totalPages]);

  const currentWebsites = websites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const skills = [
    {
      icon: 'hugeicons:chart-histogram',
      metric: '5,000+',
      label: 'Measurement Implementations',
      timeframe: '2023 – Present',
      outcome: 'Global Scale',
      detail: 'Enterprise-scale analytics solutions',
      channel: 'Cognizant (Client: Google)',
      category: 'Analytics'
    },
    {
      icon: 'hugeicons:user-group',
      metric: '2,000+',
      label: 'Advertisers Supported',
      timeframe: '2023 – Present',
      outcome: 'Global Reach',
      detail: 'Measurement strategy & implementation',
      channel: 'Cognizant (Client: Google)',
      category: 'Analytics'
    },
    {
      icon: 'hugeicons:education',
      metric: '200+',
      label: 'Training Hours Delivered',
      timeframe: '2023 – Present',
      outcome: 'Team Enablement',
      detail: 'Agents, SMEs, clients, agencies',
      channel: 'Cognizant (Client: Google)',
      category: 'Training'
    },
    {
      icon: 'hugeicons:shield-02',
      metric: 'GDPR',
      label: 'Compliance Solutions',
      timeframe: '2023 – Present',
      outcome: 'Consent Mode V2',
      detail: 'Privacy-compliant measurement',
      channel: 'Cognizant (Client: Google)',
      category: 'Privacy'
    },
    {
      icon: 'hugeicons:global-search',
      metric: 'Multiple',
      label: 'CDN Integrations',
      timeframe: '2023 – Present',
      outcome: 'Google Tag Gateway',
      detail: 'Akamai, Cloudflare, Fastly, AWS, Webflow',
      channel: 'Cognizant (Client: Google)',
      category: 'Infrastructure'
    },
    {
      icon: 'hugeicons:target-01',
      metric: 'Advanced',
      label: 'Attribution Modelling',
      timeframe: '2023 – Present',
      outcome: 'Data-Driven Attribution',
      detail: 'CM360, SA360, Cross-platform analysis',
      channel: 'Cognizant (Client: Google)',
      category: 'Attribution'
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-6">
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              My <span className="text-orange-600 dark:text-orange-400">Works</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Proven results across digital marketing, analytics, and web development.
              Every project focused on delivering measurable business impact.
            </p>
          </m.div>

          {/* Section 1: Websites I Have Built */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Websites I Have Built / Managed
            </h2>
            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 min-h-[450px]">
              <AnimatePresence mode="popLayout">
                {currentWebsites.map((project, index) => (
                  <m.div
                    key={project.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="relative bg-white/30 dark:bg-gray-900 rounded-[2rem] p-[2px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(234,88,12,0.1)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] backdrop-blur-md"
                  >
                    {/* Background Orange Shade */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/20 dark:bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />

                    {/* Cyberpunk Animated Border Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 dark:from-blue-500 dark:via-cyan-400 dark:to-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-[2rem]" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_3s_linear_infinite] opacity-0 group-hover:opacity-30" />
                    
                  {/* Inner Tech Card */}
                  <div className="relative h-full bg-white/60 dark:bg-gray-950/90 rounded-[1.9rem] p-6 md:p-8 backdrop-blur-2xl border border-white/50 dark:border-gray-800 z-10 flex flex-col">
                    {/* Tech grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-[1.9rem]" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-20">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-all duration-300 ring-1 ring-gray-100 dark:ring-white/10">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className={`w-full h-full object-contain ${project.image.endsWith('.jpg') || project.image.endsWith('.png') ? 'mix-blend-multiply dark:mix-blend-normal' : ''}`}
                        />
                      </div>
                      <span className="px-4 py-1.5 bg-white/80 dark:bg-gray-900/80 border border-orange-200 dark:border-cyan-500/30 text-orange-600 dark:text-cyan-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
                        &lt;{project.category}/&gt;
                      </span>
                    </div>

                    <div className="mb-6 relative z-20 flex-grow">
                      <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 mb-3 tracking-tight drop-shadow-sm dark:drop-shadow-md">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 dark:bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)] dark:shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <p className="text-sm font-mono font-bold text-gray-700 dark:text-gray-400 uppercase tracking-[0.15em]">
                          CMS: {project.platform}
                        </p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-base font-medium">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 relative z-20 flex items-center justify-between mt-auto">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-cyan-400 font-bold transition-all group/link tracking-wide text-base"
                      >
                        Visit Website
                        <Icon icon="hugeicons:arrow-up-right-01" className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </m.div>
              ))}
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentPage === idx 
                        ? 'bg-orange-600 dark:bg-cyan-500 scale-125' 
                        : 'bg-gray-300 dark:bg-gray-700 hover:bg-orange-300 dark:hover:bg-cyan-800'
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </m.div>

          {/* Section 2: My Skills and Services */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              My Skills and Services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {skills.map((skill, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon icon={skill.icon} className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <span className="px-2 md:px-3 py-1 bg-orange-100 dark:bg-blue-900/30 text-orange-600 dark:text-blue-400 rounded-full text-xs md:text-sm font-medium">
                      {skill.category}
                    </span>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {skill.metric}
                    </p>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                      {skill.label}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-500 text-xs md:text-sm">Timeframe:</span>
                      <span className="text-gray-900 dark:text-white text-xs md:text-sm font-medium">{skill.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-500 text-xs md:text-sm">Outcome:</span>
                      <span className="text-gray-900 dark:text-white text-xs md:text-sm font-medium">{skill.outcome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-500 text-xs md:text-sm">Detail:</span>
                      <span className="text-gray-900 dark:text-white text-xs md:text-sm font-medium">{skill.detail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-500 text-xs md:text-sm">Channel:</span>
                      <span className="text-gray-900 dark:text-white text-xs md:text-sm font-medium">{skill.channel}</span>
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      Delivered measurable results through strategic implementation
                    </p>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-transparent to-orange-50 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to Scale Your Business?
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Let's discuss how I can help you achieve similar results for your business.
          </m.p>
          <m.a
            href="/contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-orange-600 hover:bg-orange-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-full transition-all"
          >
            Get In Touch
          </m.a>
        </div>
      </section>
    </div>
  );
};

export default Works;
