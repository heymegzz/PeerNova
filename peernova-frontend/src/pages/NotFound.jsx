import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-6">404</h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">Page not found</p>
        <p className="text-gray-500 mb-10">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
