import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-8 h-8 text-skyblue-300" />
              <span className="font-bold text-xl">Lost Dane Found</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Denmark High School, Alpharetta, GA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-skyblue-300 transition">
                  {t('nav.browse')}
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-400 hover:text-skyblue-300 transition">
                  {t('nav.reportFound')}
                </Link>
              </li>
              <li>
                <a
                  href="https://www.forsyth.k12.ga.us/denmark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-skyblue-300 transition"
                >
                  {t('footer.schoolWebsite', 'School Website')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>lostandfound@denmark.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{t('footer.mainOffice', 'Main Office')}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t('footer.lostFoundRoom', 'Room 101 (Lost & Found)')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 {t('footer.copyright')}
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Go Danes! 🐕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;