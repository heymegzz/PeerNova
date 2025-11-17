import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Roadmap', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'License', href: '#' },
      ]
    },
    {
      title: 'Social',
      links: [
        { label: 'Twitter', href: '#' },
        { label: 'GitHub', href: '#' },
        { label: 'LinkedIn', href: '#' },
        { label: 'Discord', href: '#' },
      ]
    }
  ];

  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 transition-opacity hover:opacity-80">
              <h3 className="text-base font-bold">
                <span className="text-white">Peer</span>
                <span className="text-gray-400">Nova</span>
              </h3>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Campus collaboration platform for students to connect, share resources, and grow together.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-gray-500 text-xs">
              &copy; {currentYear} PeerNova. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 text-xs hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 text-xs hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
