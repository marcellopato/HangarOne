import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Warehouse, 
  Users, 
  Plane, 
  FileText, 
  Settings, 
  BarChart3,
  Home
} from 'lucide-react';

interface SidebarProps {
  userRole: string;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/',
    roles: ['superadmin', 'admin', 'manager', 'pilot']
  },
  {
    icon: Building2,
    label: 'Aeroclubes',
    path: '/clubs',
    roles: ['superadmin', 'admin', 'manager']
  },
  {
    icon: Warehouse,
    label: 'Hangares',
    path: '/hangars',
    roles: ['superadmin', 'admin', 'manager']
  },
  {
    icon: Users,
    label: 'Pilotos',
    path: '/pilots',
    roles: ['superadmin', 'admin', 'manager']
  },
  {
    icon: Plane,
    label: 'Aeronaves',
    path: '/aircraft',
    roles: ['superadmin', 'admin', 'manager', 'pilot']
  },
  {
    icon: FileText,
    label: 'Documentos',
    path: '/documents',
    roles: ['superadmin', 'admin', 'manager', 'pilot']
  },
  {
    icon: BarChart3,
    label: 'Relatórios',
    path: '/reports',
    roles: ['superadmin', 'admin', 'manager']
  },
  {
    icon: Settings,
    label: 'Configurações',
    path: '/settings',
    roles: ['superadmin', 'admin']
  }
];

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="bg-white w-64 min-h-screen shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🚁</span>
          <h1 className="text-xl font-bold text-gray-900">HangarOne</h1>
        </div>

        <nav className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;