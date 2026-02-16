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
            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 group">
                            <div className="relative">
                                <Shield className="h-8 w-8 text-green-500 transition-transform group-hover:scale-110" />
                                <Leaf className="absolute -right-1 -top-1 h-4 w-4 text-emerald-400" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                EcoWIPE
                            </span>
                        </Link>
                        <p className="mb-4 max-w-sm text-sm text-gray-400">
                            Secure, certified data wiping with eco-friendly practices.
                            Protect your data, protect the planet.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-green-400"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Link Sections */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-sm text-gray-400 transition-colors hover:text-green-400"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-sm text-gray-400">
                            © {currentYear} EcoWIPE. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-xs text-gray-500">
                            <span>Made with ♻️ for a sustainable future</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
