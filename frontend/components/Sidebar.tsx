import { Home, FileText, HelpCircle, Phone, Info, Settings, Users, Building, Mail, Search } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: FileText, label: 'Services', href: '#' },
    { icon: FileText, label: 'Online Services', href: '#' },
    { icon: Info, label: 'About', href: '#' },
    { icon: Info, label: 'About Us', href: '#' },
    { icon: Phone, label: 'Contact', href: '#' },
    { icon: Mail, label: 'Contact Us', href: '#' },
    { icon: HelpCircle, label: 'FAQ', href: '#' },
    { icon: HelpCircle, label: 'Help', href: '#' },
    { icon: Search, label: 'Resources', href: '#' },
    { icon: Users, label: 'Departments', href: '#' },
    { icon: Building, label: 'Offices', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-300 min-h-screen p-4">
      <nav>
        <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b-2 border-blue-900">
          Navigation
        </h2>
        <ul className="space-y-1">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <li key={index}>
                <a
                  href={link.href}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded transition-colors"
                >
                  <Icon size={18} />
                  <span className="text-sm">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
