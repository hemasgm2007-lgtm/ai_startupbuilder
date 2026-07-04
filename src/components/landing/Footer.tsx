import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from '../common/Logo';

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'FAQ', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Resources: ['Documentation', 'API Reference', 'Community', 'Support'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              The AI-powered platform that turns startup ideas into investor-ready business plans in minutes.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 transition-colors flex items-center justify-center"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} AI Startup Builder. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with AI for founders.
          </p>
        </div>
      </div>
    </footer>
  );
}
