import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    { 
      title: 'Study Groups', 
      description: 'Join or create study groups',
      icon: '👥'
    },
    { 
      title: 'Community Feed', 
      description: 'See posts from your network',
      icon: '💬'
    },
    { 
      title: 'Resources', 
      description: 'Share and discover resources',
      icon: '📚'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar isAuthenticated={true} onLogout={handleLogout} />

      <div className="flex-1 px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-400 text-sm">Your PeerNova dashboard is ready. More features coming soon!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((item) => (
              <div 
                key={item.title} 
                className="p-5 bg-[#111111] border border-[#1a1a1a] rounded-lg hover:border-[#333333] transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2 text-base">{item.title}</h3>
                <p className="text-gray-400 text-xs mb-4">{item.description}</p>
                <Button variant="secondary" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
