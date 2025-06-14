
import React from 'react';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/4e754411-f45d-4a91-ab35-0a83455e3623.png" 
                alt="VyayamZone Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">VyayamZone</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Your personal wellness partner. Connect with certified trainers and transform your fitness journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="block text-slate-300 hover:text-teal-400 transition-colors duration-300 text-sm">
                Home
              </a>
              <a href="/about" className="block text-slate-300 hover:text-teal-400 transition-colors duration-300 text-sm">
                About Us
              </a>
              <a href="/services" className="block text-slate-300 hover:text-teal-400 transition-colors duration-300 text-sm">
                Services
              </a>
              <a href="/contact" className="block text-slate-300 hover:text-teal-400 transition-colors duration-300 text-sm">
                Contact
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              <p className="text-slate-300 text-sm">Personal Training</p>
              <p className="text-slate-300 text-sm">Yoga & Meditation</p>
              <p className="text-slate-300 text-sm">Zumba Classes</p>
              <p className="text-slate-300 text-sm">Physiotherapy</p>
              <p className="text-slate-300 text-sm">Mental Wellness</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-2">
              <p className="text-slate-300 text-sm">support@vyayamzone.com</p>
              <p className="text-slate-300 text-sm">+91 98765 43210</p>
              <div className="flex space-x-4 pt-2">
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-teal-400 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="#" 
                  className="text-slate-300 hover:text-teal-400 transition-colors duration-300"
                  aria-label="WhatsApp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 VyayamZone. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
