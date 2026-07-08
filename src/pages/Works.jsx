import { m, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

const Works = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpecialProjectModalOpen, setIsSpecialProjectModalOpen] = useState(false);
  const [selectedSpecialProject, setSelectedSpecialProject] = useState(null);

  const websites = [
    {
      image: '/pracy_logo.png',
      bgImage: '/websites/pracy_bg.png',
      title: 'Pracy',
      platform: 'Shopify',
      url: 'https://www.pracy.in/',
      description: 'E-commerce website built on Shopify with custom theme development and payment integration.',
      category: 'E-commerce'
    },
    {
      image: '/lindblom_logo.png',
      bgImage: '/websites/lindblom_hypnotherapy_bg.png',
      title: 'Lindblom Hypnotherapy',
      platform: 'Squarespace',
      url: 'https://www.lindblomhypnotherapy.com.au/',
      description: 'Professional clinical hypnotherapy website with a high conversion optimized landing page.',
      category: 'Health'
    },
    {
      image: 'https://www.google.com/s2/favicons?domain=autocraftmelbourne.com.au&sz=128',
      bgImage: '/websites/autocraft_melbourne_bg.png',
      title: 'Autocraft Melbourne',
      platform: 'Wix',
      url: 'https://www.autocraftmelbourne.com.au/',
      description: 'Automotive services website built on Wix with custom design and booking system.',
      category: 'Business'
    },
    {
      image: '/healsway_logo.jpg',
      bgImage: '/healsway_logo.jpg',
      title: 'Healsway',
      platform: 'Shopify',
      url: 'https://healsway.io/',
      description: 'Premium provider of luxurious wooden carved furniture, accessories, and sculptures with impeccable craftsmanship.',
      category: 'E-commerce'
    },
    {
      image: 'https://www.google.com/s2/favicons?domain=australianhypnotherapycentre.com.au&sz=128',
      bgImage: '/websites/australian_hypnotherapy_bg.png',
      title: 'Australian Hypnotherapy',
      platform: 'WordPress',
      url: 'https://australianhypnotherapycentre.com.au/',
      description: 'Professional hypnotherapy services platform with custom service pages and booking workflows.',
      category: 'Health'
    },
    {
      image: 'https://www.google.com/s2/favicons?domain=noatune.com&sz=128',
      bgImage: '/websites/noatune_bg.png',
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
  }, [totalPages, currentPage]);

  const currentWebsites = websites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const marketingAccounts = [
    {
      icon: 'hugeicons:google',
      metric: 'Google Ads',
      label: 'E-commerce Retailer',
      timeframe: 'Active',
      outcome: '340% ROAS',
      detail: 'Managed $50k/mo ad spend with high conversion rate.',
      channel: 'Search & Shopping',
      category: 'PPC'
    },
    {
      icon: 'hugeicons:analytics-01',
      metric: 'Google Analytics',
      label: 'SaaS Platform',
      timeframe: 'Completed',
      outcome: 'Full GA4 Migration',
      detail: 'Implemented custom event tracking and server-side tagging.',
      channel: 'Web Analytics',
      category: 'Data'
    },
    {
      icon: 'hugeicons:megaphone-01',
      metric: 'Meta Ads',
      label: 'Local Business',
      timeframe: 'Active',
      outcome: '5x Lead Volume',
      detail: 'Hyper-local targeting and dynamic creative optimization.',
      channel: 'Facebook & Instagram',
      category: 'Social'
    }
  ];

  const specialProjects = [
    {
      id: 'wcc-fix',
      title: 'Google Ads Call Conversion Fix',
      tech: 'JavaScript / DOM',
      platform: 'Squarespace',
      shortDesc: 'A unified injection script that restores monkey-patched native JS functions to rescue failing Google Ads conversions.',
      imageIcon: '/wcc_logo.png',
      details: {
        issue: "Google Ads Website Call Conversions (WCC) were failing on a Squarespace site. Google's tracking script relies on native JS methods (like Object.defineProperties) to safely scan the DOM, but Squarespace core scripts were 'monkey-patching' these methods, causing the Google script to silently crash before swapping the phone numbers.",
        identification: "By deeply inspecting the browser's DevTools console, we found that calling Object.defineProperties.toString() returned a custom wrapper function instead of the native [native code]. This was the smoking gun proving the interference.",
        resolution: 'Developed a "God-Mode" unified injector script. It waits for the page to fully load, injects a hidden iframe to resurrect the pure native JS functions, overwrites the monkey-patched versions, and then dynamically loads the Google Tag. We utilized the phone_conversion_callback to directly update customized, animated floating CTAs without needing visible bait text.',
        code: `<script>
window.addEventListener('load',function(){
  var id='AW-XXXXXXXXXX', lbl='YOUR_LABEL_HERE', num='0400 000 000';
  var i=document.createElement('iframe');i.style.display='none';document.body.appendChild(i);
  window.Object.defineProperty=i.contentWindow.Object.defineProperty;window.Object.defineProperties=i.contentWindow.Object.defineProperties;
  var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id='+id;s.async=1;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());
  gtag('config',id+'/'+lbl,{'phone_conversion_number':num});
});
</script>`
      }
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
              My <span className="text-orange-600 dark:text-orange-400">Projects</span>
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
            <div className="relative min-h-[450px]">
              <AnimatePresence mode="wait">
                <m.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
                >
                  {currentWebsites.map((project) => (
                    <m.div
                      key={project.title}
                      whileHover={{ y: -5 }}
                      className="relative bg-white/10 dark:bg-gray-900/10 rounded-[2rem] p-[1px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(234,88,12,0.15)] dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-gray-200/50 dark:border-gray-700/50"
                    >
                      {/* Blurred Website Background */}
                      <div 
                        className="absolute inset-0 bg-cover bg-top bg-no-repeat blur-[6px] opacity-80 group-hover:opacity-100 group-hover:blur-[2px] transition-all duration-700 scale-[1.05]"
                        style={{ backgroundImage: `url(${project.bgImage || project.image})` }}
                      />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/40 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/40" />

                      {/* Cyberpunk Animated Border Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 dark:from-blue-500 dark:via-cyan-400 dark:to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[2rem]" />
                    
                  {/* Inner Tech Card */}
                  <div className="relative h-full rounded-[1.9rem] p-6 md:p-8 z-10 flex flex-col">
                    
                    <div className="flex items-center justify-between mb-8 relative z-20">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-all duration-300 ring-1 ring-gray-100 dark:ring-white/10">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className={`w-full h-full object-contain ${project.image.endsWith('.jpg') || project.image.endsWith('.png') ? 'mix-blend-multiply dark:mix-blend-normal' : ''}`}
                        />
                      </div>
                      <span className="px-4 py-1.5 bg-white/80 dark:bg-gray-900/80 border border-orange-200 dark:border-cyan-500/30 text-orange-600 dark:text-cyan-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm backdrop-blur-sm">
                        &lt;{project.category}/&gt;
                      </span>
                    </div>

                    <div className="mb-6 relative z-20 flex-grow">
                      <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-3 tracking-tight drop-shadow-sm">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 dark:bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)] dark:shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <p className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300 uppercase tracking-[0.15em]">
                          CMS: {project.platform}
                        </p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base font-medium">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-6 relative z-20 flex justify-center mt-auto">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 hover:bg-orange-600 dark:bg-white dark:hover:bg-cyan-400 text-white dark:text-gray-900 font-bold rounded-xl transition-all group/link shadow-md hover:shadow-lg"
                      >
                        Visit Website
                        <Icon icon="hugeicons:arrow-up-right-01" className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                  </m.div>
                ))}
                </m.div>
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-cyan-900/30 hover:text-orange-600 dark:hover:text-cyan-400 transition-colors shadow-sm"
                  aria-label="Previous page"
                >
                  <Icon icon="hugeicons:arrow-left-01" className="w-5 h-5" />
                </button>
                
                <div className="flex justify-center items-center gap-3">
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

                <button
                  onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
                  className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-cyan-900/30 hover:text-orange-600 dark:hover:text-cyan-400 transition-colors shadow-sm"
                  aria-label="Next page"
                >
                  <Icon icon="hugeicons:arrow-right-01" className="w-5 h-5" />
                </button>
              </div>
            )}
          </m.div>

          {/* Section 3: My Projects & Custom Solutions */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 mb-16 md:mb-20"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              My Custom Projects
            </h2>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {specialProjects.map((project, index) => (
                <m.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    setSelectedSpecialProject(project);
                    setIsSpecialProjectModalOpen(true);
                  }}
                  className="relative bg-white/40 dark:bg-gray-900/60 rounded-[2rem] p-[1px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_0_30px_rgba(0,0,0,0.6)] group overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)] dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.25)] backdrop-blur-xl cursor-pointer border border-gray-200 dark:border-gray-800"
                >
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/20 dark:bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-orange-500/30 dark:group-hover:bg-cyan-400/20 transition-all duration-700" />
                  
                  {/* Inner Premium Card */}
                  <div className="relative h-full bg-white/70 dark:bg-gray-950/80 rounded-[1.9rem] p-8 md:p-10 z-10 flex flex-col">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-[1.9rem]" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-20">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center p-2 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-300 ring-1 ring-gray-200 dark:ring-white/10">
                        {project.imageIcon ? (
                          <img src={project.imageIcon} alt={project.title} className="w-10 h-10 object-contain drop-shadow-lg" />
                        ) : (
                          <Icon icon={project.icon} className="w-8 h-8 text-orange-600 dark:text-cyan-400" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/80 dark:bg-gray-900/80 border border-orange-200 dark:border-cyan-500/30 text-orange-600 dark:text-cyan-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
                          {project.tech}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 relative z-20 flex-grow">
                      <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 mb-3 tracking-tight drop-shadow-sm dark:drop-shadow-md">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 dark:bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)] dark:shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <p className="text-sm font-mono font-bold text-gray-700 dark:text-gray-400 uppercase tracking-[0.15em]">
                          {project.platform}
                        </p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-300 leading-relaxed text-base font-medium">
                        {project.shortDesc}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-200/60 dark:border-gray-800 relative z-20 flex items-center justify-between mt-auto">
                      <span className="inline-flex items-center gap-2 text-orange-600 dark:text-cyan-400 font-bold transition-all group/link tracking-wide text-base">
                        View Solution
                        <Icon icon="hugeicons:arrow-right-01" className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>
          {/* Section 2: My Skills and Services */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Digital Marketing & Analytics
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {marketingAccounts.map((account, index) => (
                <m.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/60 dark:bg-gray-900/60 rounded-[2rem] p-[1px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(234,88,12,0.1)] dark:hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all group border border-gray-200 dark:border-gray-800 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 dark:bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="relative h-full bg-white/70 dark:bg-gray-950/80 rounded-[1.9rem] p-6 md:p-8 z-10 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-orange-200/50 dark:border-gray-700">
                        <Icon icon={account.icon} className="w-7 h-7 text-orange-600 dark:text-cyan-400" />
                      </div>
                      <span className="px-3 py-1 bg-orange-50 dark:bg-cyan-900/20 border border-orange-200 dark:border-cyan-800/50 text-orange-600 dark:text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        {account.category}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
                        {account.metric}
                      </h3>
                      <p className="text-orange-600 dark:text-cyan-400 font-medium">
                        {account.label}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6 flex-grow">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{account.detail}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400 dark:bg-cyan-500" />
                        <span className="text-gray-900 dark:text-white text-sm font-semibold">{account.outcome}</span>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center mt-auto">
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {account.channel}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${account.timeframe === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {account.timeframe}
                      </span>
                    </div>
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

      {/* Special Project Modal */}
      <AnimatePresence>
        {isSpecialProjectModalOpen && selectedSpecialProject && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setIsSpecialProjectModalOpen(false)}
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-3xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center overflow-hidden">
                    {selectedSpecialProject.imageIcon ? (
                      <img src={selectedSpecialProject.imageIcon} alt={selectedSpecialProject.title} className="w-full h-full object-cover scale-125" />
                    ) : (
                      <Icon icon={selectedSpecialProject.icon} className="w-6 h-6 text-orange-600 dark:text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                      {selectedSpecialProject.title}
                    </h3>
                    <p className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
                      {selectedSpecialProject.platform} • {selectedSpecialProject.tech}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSpecialProjectModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <Icon icon="hugeicons:cancel-01" className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                    <Icon icon="hugeicons:alert-01" className="text-red-500" /> The Issue
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {selectedSpecialProject.details.issue}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                    <Icon icon="hugeicons:search-01" className="text-orange-500" /> Identification
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {selectedSpecialProject.details.identification}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                    <Icon icon="hugeicons:tick-double-01" className="text-green-500" /> Resolution
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-4">
                    {selectedSpecialProject.details.resolution}
                  </p>
                  <div className="relative group">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1 bg-gray-800 text-xs text-gray-300 rounded font-mono">JS Template</span>
                    </div>
                    <pre className="bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono border border-gray-800 shadow-inner">
                      <code>{selectedSpecialProject.details.code}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsSpecialProjectModalOpen(false)}
                  className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Close Case Study
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Works;
