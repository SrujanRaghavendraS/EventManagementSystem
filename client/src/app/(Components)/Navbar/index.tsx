// Navbar.tsx
import { User, Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between mb-8 bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="text-3xl font-bold text-green-500">EMS</div>
      <div className="flex items-center space-x-4">
          
        <button className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
