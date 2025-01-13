"use client"
import { Layout, Clipboard, Calendar, Bell, User } from 'lucide-react';  // Import the User icon
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use usePathname from next/navigation

const SidebarLink = ({ href, icon, label, isActive }: { href: string; icon: JSX.Element; label: string; isActive: boolean }) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center py-3 px-4 hover:bg-gray-700 rounded-full transition-all duration-200 w-full justify-center lg:justify-start ${isActive ? 'bg-gray-700' : ''}`}
      >
        <div className="mr-3">{icon}</div>
        <span className="hidden lg:inline-block font-medium">{label}</span>
      </div>
    </Link>
  );
};

type SidebarProps = {
  userId: number;  // Accept only the user_id as a number
};

const Sidebar = ({ userId }: SidebarProps) => {
  const pathname = usePathname(); // Get the current route

  return (
    <div className="fixed top-0 left-0 h-full bg-gray-800 z-40 sm:w-20 lg:w-64 transition-all duration-300 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center pt-8 space-y-4">
        {/* Profile link at the top with query parameters */}
        <SidebarLink 
          href={`/dashboard?user_id=${userId}`} 
          icon={<User />} 
          label="Dashboard" 
          isActive={pathname === `/dashboard`}
        />
        <SidebarLink 
          href={`/profile?user_id=${userId}`} 
          icon={<User />} 
          label="Profile" 
          isActive={pathname === `/profile`}
        />
        <SidebarLink
          href={`/Events?user_id=${userId}`}
          icon={<Calendar />}
          label="Events"
          isActive={pathname === '/Events'}
        />
        <SidebarLink 
          href={`/tasks?user_id=${userId}`} 
          icon={<Clipboard />} 
          label="Tasks" 
          isActive={pathname === '/tasks'}
        />
        <SidebarLink
          href={`/past?user_id=${userId}`}
          icon={<Layout />}
          label="Past Events"
          isActive={pathname === '/past'}
        />
        <SidebarLink
          href={`/notifications?user_id=${userId}`}
          icon={<Bell />}
          label="Notifications"
          isActive={pathname === '/notifications'}
        />
      </div>
    </div>
  );
};

export default Sidebar;
