import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  BookOpenIcon,
  UserIcon,
  ChartBarIcon,
  AcademicCapIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import DashboardLayout from '../components/layouts/DashboardLayout';
import axiosInstance from '../api/axios';
import ENDPOINTS from '../api/endpoints';
import LoadingSpinner from '../components/states/LoadingSpinner';

function Dashboard() {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);

  // Quotes array - defined at top level
  const quotes = [
    "Alone we can do so little; together we can do so much. - Helen Keller",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "Learning never exhausts the mind. - Leonardo da Vinci",
    "Knowledge is power. Information is liberating. - Kofi Annan",
  ];

  // Initialize quote at top level (hooks must be called unconditionally)
  const [currentQuote] = useState(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setLocalUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch profile stats from API
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-profile'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.PROFILE);
      return response.data.data;
    },
    enabled: !!localUser, // Only fetch if user is logged in
    retry: 1,
  });

  if (!localUser) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <LoadingSpinner fullPage message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  // Handle error gracefully - show dashboard with default stats
  if (isError) {
    console.error('Dashboard error:', error);
  }

  const user = localUser || {};
  const stats = profile?.stats || {
    groupsJoined: 0,
    groupsCreated: 0,
    resourcesUploaded: 0,
  };

  const quickLinks = [
    {
      title: 'Study Groups',
      description: 'Discover and join active study groups across your campus.',
      icon: UserGroupIcon,
      to: '/study-groups',
      cta: 'Browse Groups',
      color: 'text-blue-400',
    },
    {
      title: 'Resources',
      description: 'Upload notes, slides, and materials for your peers.',
      icon: BookOpenIcon,
      to: '/resources',
      cta: 'Explore Resources',
      color: 'text-purple-400',
    },
    {
      title: 'Profile',
      description: 'Update your profile and see your contribution stats.',
      icon: UserIcon,
      to: '/profile',
      cta: 'View Profile',
      color: 'text-green-400',
    },
  ];

  const statsList = [
    {
      label: 'Groups Joined',
      value: stats.groupsJoined,
      icon: UserGroupIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Groups Created',
      value: stats.groupsCreated,
      icon: AcademicCapIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      label: 'Resources Uploaded',
      value: stats.resourcesUploaded,
      icon: BookOpenIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
  ];

  // Get user name safely
  const userName = user?.name || user?.fullName || user?.email?.split('@')[0] || 'Student';

  return (
    <DashboardLayout
      title={`Welcome back, ${userName}!`}
      description="Here's a quick overview of your activity and shortcuts to the most important areas of PeerNova."
    >
      <div className="space-y-8">
        {/* Welcome Quote Section */}
        <section className="rounded-2xl border border-[#1a1a1a] bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <LightBulbIcon className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm mb-2">Daily Inspiration</h3>
              <p className="text-gray-300 text-sm md:text-base italic leading-relaxed">
                "{currentQuote}"
              </p>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4" />
            Your Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsList.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#1a1a1a] bg-[#111111] p-5 hover:border-[#333333] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AcademicCapIcon className="h-4 w-4" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group block rounded-xl border border-[#1a1a1a] bg-[#111111] p-6 hover:border-[#333333] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-[#1a1a1a] mb-4 group-hover:bg-white/10 transition-colors`}>
                    <IconComponent className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-base">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="group-hover:bg-white group-hover:text-black w-full"
                  >
                    {item.cta}
                  </Button>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
