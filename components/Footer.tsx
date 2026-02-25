import { Radio, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-cta to-yellow-500 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg">Nova Daily</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/0xcevin/nova-daily"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nova-muted hover:text-nova-text transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          <p className="text-nova-muted text-sm">
            Powered by Sui & Walrus
          </p>
        </div>
      </div>
    </footer>
  );
}