import { m } from 'framer-motion';
import { Icon } from '@iconify/react';

const FreelanceServices = () => {
  const services = [
    {
      title: 'Google Ads Management',
      subtitle: 'Optimizing Campaigns & Maximize ROAS',
      icon: 'logos:google-ads',
      description: 'Strategic campaign structuring, bid optimization, and advanced audience targeting to drive highly qualified leads and e-commerce sales.',
      color: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/20'
    },
    {
      title: 'Meta Ads Management',
      subtitle: 'Scaling Facebook & Instagram ROI',
      icon: 'logos:meta-icon',
      description: 'End-to-end management of Meta advertising including creative testing, pixel optimization, and full-funnel retargeting strategies.',
      color: 'from-indigo-500/20 to-indigo-600/5',
      border: 'border-indigo-500/20'
    },
    {
      title: 'Conversion & Pixel Tracking',
      subtitle: 'Meta, Google Ads & GA4 Integration',
      icon: 'mdi:chart-timeline-variant-shimmer',
      description: 'Flawless server-side and client-side tracking setups. Ensuring zero data loss, exact attribution, and compliance with Consent Mode V2.',
      color: 'from-orange-500/20 to-orange-600/5',
      border: 'border-orange-500/20'
    },
    {
      title: 'Website Development',
      subtitle: 'High-Converting Landing Pages',
      icon: 'hugeicons:laptop-programming',
      description: 'Building blazing-fast, SEO-optimized, and aesthetically pleasing websites tailored to convert paid traffic into actual revenue.',
      color: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Automation Services',
      subtitle: 'Zapier, n8n & App Scripts',
      icon: 'hugeicons:workflow-circle-06',
      description: 'Automating repetitive business processes. From seamless CRM integrations to complex multi-step data pipelines using n8n and Zapier.',
      color: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20'
    }
  ];

  const clients = [
    { name: 'Traya Health', domain: 'traya.health' },
    { name: 'Atlas Mofa', domain: 'atlasmofa.com' },
    { name: 'Paradigm Consulting', domain: 'the-paradigm.com' },
    { name: 'Australian Hypnotherapy', domain: 'australianhypnotherapycentre.com.au' },
    { name: 'Iam Lou', domain: 'i-amlou.com' },
    { name: 'Healsway', domain: 'healsway.io' },
    { name: 'Sled Manuals', domain: 'sledmanuals.com' },
    { name: 'Noatune', domain: 'noatune.com' },
    { name: 'AlphaFitness', domain: 'alphafitnessathlete.com' },
    { name: 'Usis Biz Park', domain: 'usislt.com' },
    { name: 'Pracy', domain: 'pracy.in' },
    { name: 'Fenebris', domain: 'fenebrisindia.com' },
    { name: 'House Of Electrons', domain: 'houseofelectrons.com' },
    { name: 'Focally', domain: 'focally.in' },
    { name: 'AutoCraft Melbourne', domain: 'autocraftmelbourne.com.au' }
  ];

  const tools = [
    { name: 'Zapier', icon: 'logos:zapier' },
    { name: 'HubSpot', icon: 'logos:hubspot' },
    { name: 'MailerLite', icon: '/mailerlite_logo.png' },
    { name: 'n8n', icon: 'simple-icons:n8n' },
    { name: 'App Scripts', icon: 'https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png' },
    { name: 'WordPress', icon: 'logos:wordpress-icon' },
    { name: 'Wix', icon: 'logos:wix' },
    { name: 'Squarespace', icon: 'simple-icons:squarespace' },
    { name: 'Shopify', icon: 'logos:shopify' },
    { name: 'Webflow', icon: 'logos:webflow' },
    { name: 'Magento', icon: 'logos:magento' },
    { name: 'Duda', icon: '/duda_logo.jpg' },
    { name: 'BigCommerce', icon: 'simple-icons:bigcommerce' },
    { name: 'Salesforce', icon: 'logos:salesforce' },
    { name: 'Klaviyo', icon: '/klaviyo_logo.jpg' },
    { name: 'Mailchimp', icon: '/mailchimp_logo.jpg' },
    { name: 'Zoho', icon: '/zoho_logo.png' },
    { name: 'GoHighLevel', icon: 'fluent:rocket-20-filled' },
    { name: 'SEMrush', icon: 'simple-icons:semrush' },
    { name: 'Ahrefs', icon: '/ahrefs_logo.jpg' },
    { name: 'Google Search Console', icon: '/gsc_logo.jpg' },
    { name: 'Google Merchant Center', icon: 'https://www.gstatic.com/images/branding/product/1x/merchant_center_48dp.png' }
  ];

  return (
    <section className="py-24 px-6 overflow-hidden bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-600 dark:text-orange-400 font-medium text-lg tracking-wide uppercase mb-4 block">
            Beyond The 9 to 5
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Freelance & Independent Consultancy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            I partner directly with brands, agencies, and startups to drive growth. From architecting robust tracking infrastructures to scaling paid media profitability, I act as an extension of your team to maximize your digital ROI.
          </p>
        </m.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {services.map((service, index) => (
            <m.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`p-8 rounded-3xl bg-gradient-to-br ${service.color} dark:from-gray-900/50 dark:to-gray-900 border ${service.border} dark:border-gray-800 shadow-xl backdrop-blur-sm transition-all group cursor-pointer`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon icon={service.icon} className="w-8 h-8 text-gray-900 dark:text-white" style={{ color: service.icon.startsWith('logos:') ? 'unset' : undefined }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {service.title}
              </h3>
              <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-4 tracking-wide uppercase">
                {service.subtitle}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </m.div>
          ))}
        </div>

        {/* Clients Marquee */}
        <div className="mb-24">
          <m.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl font-semibold text-gray-400 dark:text-gray-500 mb-10 uppercase tracking-widest"
          >
            Trusted by Global Brands & Startups
          </m.h3>
          
          <div className="relative w-full flex overflow-hidden mask-horizontal-fade">
            <div className="flex animate-marquee whitespace-nowrap py-4">
              {[...clients, ...clients].map((client, index) => {
                // Use custom local images for domains that fail with Google Favicon
                const customLogos = {
                  'traya.health': '/traya_logo.jpg',
                  'healsway.io': '/healsway_logo.jpg',
                  'pracy.in': '/pracy_logo.png',
                  'houseofelectrons.com': '/houseofelectrons_logo.webp'
                };
                const imgSrc = customLogos[client.domain] || `https://www.google.com/s2/favicons?domain=${client.domain}&sz=128`;
                
                return (
                  <div key={`${client.domain}-${index}`} className="flex flex-col items-center justify-center mx-8 sm:mx-12 min-w-[120px] group cursor-pointer">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden p-[2px] shadow-sm">
                      {/* Base static border */}
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-2xl transition-opacity duration-300 group-hover:opacity-0"></div>
                      
                      {/* Rotating glow border effect */}
                      <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_360deg)] dark:bg-[conic-gradient(from_0deg,transparent_0_300deg,#3b82f6_360deg)] animate-[spin_2s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Inner content layer */}
                      <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-[14px] flex items-center justify-center p-3 z-10">
                        <div className="w-full h-full flex items-center justify-center dark:bg-white dark:rounded-xl dark:p-1">
                          <img 
                            src={imgSrc} 
                            alt={client.name}
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            onError={(e) => {
                               // Fallback to text if image completely fails
                               e.target.style.display = 'none';
                               e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <span style={{ display: 'none' }} className="text-xs font-bold text-gray-500 text-center uppercase tracking-wider">{client.name[0]}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-blue-400 transition-colors">
                      {client.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tools & CMS Marquee */}
        <div>
          <m.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl font-semibold text-gray-400 dark:text-gray-500 mb-10 uppercase tracking-widest"
          >
            Platforms & Automations I Master
          </m.h3>
          
          <div className="relative w-full flex overflow-hidden mask-horizontal-fade">
            <div className="flex animate-marquee-reverse whitespace-nowrap py-4">
              {[...tools, ...tools].map((tool, index) => (
                <div key={`${tool.name}-${index}`} className="flex items-center gap-3 mx-8 sm:mx-10 px-6 py-3 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-blue-900/50 hover:bg-orange-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-default">
                  <div className="flex items-center justify-center dark:bg-white dark:rounded-md dark:p-1 dark:shadow-sm">
                    {tool.icon.startsWith('http') || tool.icon.startsWith('/') ? (
                      <img 
                        src={tool.icon} 
                        alt={tool.name} 
                        className={`h-5 sm:h-6 w-auto max-w-[80px] object-contain mix-blend-multiply dark:mix-blend-normal ${tool.name === 'Google Merchant Center' || tool.name === 'App Scripts' ? 'scale-110' : ''}`} 
                      />
                    ) : (
                      <Icon icon={tool.icon} className="w-6 h-6" style={{ color: tool.icon.startsWith('logos:') || tool.icon.startsWith('simple-icons:n8n') ? 'unset' : undefined }} />
                    )}
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FreelanceServices;
