import React from 'react';
import { InstagramIcon } from './icons/InstagramIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { FacebookIcon } from './icons/FacebookIcon';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/goatscore.br' },
    { name: 'TikTok', icon: TikTokIcon, href: 'https://tiktok.com/@goatscore.br' },
    { name: 'YouTube', icon: YouTubeIcon, href: 'https://youtube.com/@goatscore.br' },
    { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/goatscore.br' },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-6">
        <div className="flex justify-center items-center gap-6 md:gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GoatScore on ${link.name}`}
              className="text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
            >
              <link.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          &copy; {new Date().getFullYear()} GoatScore. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;