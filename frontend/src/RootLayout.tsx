import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="mt-16">
        <Outlet />
      </div>
      <div className="mb-0">
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;