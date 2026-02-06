import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-8 bg-secondary border-t border-slate-800 text-center text-slate-400">
            <p className="flex items-center justify-center gap-2">
                Designed & Built with <Heart size={16} className="text-red-500 fill-current" /> by Kavini Premarathna
            </p>
            <p className="text-sm mt-2 opacity-60">© {new Date().getFullYear()} All rights reserved.</p>
        </footer>
    );
};

export default Footer;
