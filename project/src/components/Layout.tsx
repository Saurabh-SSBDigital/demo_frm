// import React, { useState } from 'react';
// import { Menu, X, Home, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

// interface LayoutProps {
//   children: React.ReactNode;
//   currentPage: string;
//   onPageChange: (page: string) => void;
// }

// const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const navigation = [
//     { name: 'Dashboard', href: 'dashboard', icon: Home },
//     { name: 'Reports', href: 'reports', icon: BarChart3 },
//     { name: 'Settings', href: 'settings', icon: Settings },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile menu overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 z-50 flex flex-col
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         ${sidebarCollapsed ? 'w-16' : 'w-64'}
//         lg:translate-x-0 transition-all duration-300 ease-in-out
//         bg-gray-900 text-white
//       `}>
//         {/* Sidebar header */}
//         <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
//           {!sidebarCollapsed && (
//             <h1 className="text-xl font-bold text-white">DataTable Pro</h1>
//           )}
//           <button
//             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//             className="hidden lg:block p-1 rounded-md hover:bg-gray-700 transition-colors"
//           >
//             {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//           </button>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden p-1 rounded-md hover:bg-gray-700 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const isActive = currentPage === item.href;

//             return (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   onPageChange(item.href);
//                   setSidebarOpen(false);
//                 }}
//                 className={`
//                   w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
//                   transition-all duration-200 ease-in-out
//                   ${isActive 
//                     ? 'bg-blue-600 text-white shadow-lg' 
//                     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                   }
//                   ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
//                 `}
//               >
//                 <Icon size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
//                 {!sidebarCollapsed && <span>{item.name}</span>}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-700">
//           {!sidebarCollapsed && (
//             <p className="text-xs text-gray-400 text-center">
//               © 2025 DataTable Pro
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Main content */}
//       <div className={`
//         transition-all duration-300 ease-in-out
//         ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
//       `}>
//         {/* Mobile header */}
//         <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//           >
//             <Menu size={24} />
//           </button>
//           <h1 className="text-lg font-semibold text-gray-900">DataTable Pro</h1>
//           <div className="w-10" />
//         </div>

//         {/* Page content */}
//         <main className="p-4 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;







import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigation = [
    { name: 'Pacs Accounts', href: 'dashboard', icon: Home },
    // { name: 'Reports', href: 'reports', icon: BarChart3 },
    // { name: 'Settings', href: 'settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
  fixed inset-y-0 left-0 z-50 flex flex-col
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  ${sidebarCollapsed ? 'w-16' : 'w-64'}
  lg:translate-x-0 transition-all duration-300 ease-in-out
  bg-gradient-to-br from-gray-800 via-gray-900 to-black
  backdrop-blur-md bg-opacity-90 shadow-2xl text-white
`}

      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold tracking-wide text-white">Pacs DMR</h1>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-1 rounded hover:bg-white/10 transition"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href;

            return (
              <button
                key={item.name}
                onClick={() => {
                  onPageChange(item.href);
                  setSidebarOpen(false);
                }}
                className={`
                  group w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                <Icon size={20} className={`${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 text-center border-t border-white/10 text-white/60 text-xs">
          {!sidebarCollapsed && '© 2025 SSB Digital'}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
          transition-all duration-300 ease-in-out
          bg-gray-100
        `}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-base font-semibold">SSB Digital</h1>
          <div className="w-10" />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
