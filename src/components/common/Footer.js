import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Leaf, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Product: [
            { name: 'Features', path: '/features' },
            { name: 'Testimonials', path: '/testimonials' },
            { name: 'FAQ', path: '/faq' },
            { name: 'Start Wipe', path: '/wipe' },
        ],
        Support: [
            { name: 'Documentation', path: '#' },
            { name: 'Contact Us', path: '#' },
            { name: 'Privacy Policy', path: '#' },
            { name: 'Terms of Service', path: '#' },
        ],
        Compliance: [
            { name: 'DoD 5220.22-M', path: '#' },
            { name: 'ISO 27001', path: '#' },
            { name: 'NIST 800-88', path: '#' },
            { name: 'GDPR', path: '#' },
        ],
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
                {/* Main Footer Content */}
                <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
                    {/* Brand Section */}
                    <div className="lg:w-1/3">
                        <Link to="/" className="flex items-center gap-2 mb-3 group w-max">
                            <div className="relative">
                                <Shield className="h-6 w-6 md:h-8 md:w-8 text-green-500 transition-transform group-hover:scale-110" />
                                <Leaf className="absolute -right-1 -top-1 h-3 w-3 md:h-4 md:w-4 text-emerald-400" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                EcoWIPE
                            </span>
                        </Link>
                        <p className="mb-4 max-w-xs text-xs md:text-sm text-gray-400 leading-relaxed">
                            Secure, certified data wiping with eco-friendly practices. <br className="hidden md:block" />
                            Protect your data, protect the planet.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-2">
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-1.5 md:p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="Email"
                            >
                                <Mail className="h-4 w-4 md:h-5 md:w-5" />
                            </a>
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-1.5 md:p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="GitHub"
                            >
                                <Github className="h-4 w-4 md:h-5 md:w-5" />
                            </a>
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-1.5 md:p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                            </a>
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-1.5 md:p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Link Sections */}
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:w-2/3 lg:justify-items-end flex-1">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title} className="lg:text-left">
                                <h3 className="mb-3 text-sm font-semibold text-white tracking-wide uppercase">{title}</h3>
                                <ul className="space-y-2">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                to={link.path}
                                                className="text-xs md:text-sm text-gray-400 transition-colors hover:text-green-400 block py-1"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 md:mt-12 border-t border-gray-700/50 pt-6">
                    <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
                        <p className="text-xs md:text-sm text-gray-400">
                            © {currentYear} EcoWIPE. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs text-gray-500">
                            <span>Made with ♻️ for a sustainable future</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
