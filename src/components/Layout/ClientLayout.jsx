import { Outlet } from 'react-router-dom';
import ClientNavBar from './ClientNavBar';

export default function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f1117]">
      <ClientNavBar />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
