import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/common/Button';
import DashboardLayout from '../components/layouts/DashboardLayout';
import axiosInstance from '../api/axios';
import ENDPOINTS from '../api/endpoints';
import LoadingSpinner from '../components/states/LoadingSpinner';

function Dashboard() {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setLocalUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch profile stats from API
  const { data: profile, isLoading } = useQuery({
    queryKey: ['dashboard-profile'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.PROFILE);
      return response.data.data;
    },
    enabled: !!localUser, // Only fetch if user is logged in
  });

  if (!localUser || isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <LoadingSpinner fullPage message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  const user = localUser;
  const stats = profile?.stats || {
    groupsJoined: 0,
    groupsCreated: 0,
    resourcesUploaded: 0,
  };

  const quickLinks = [
    {
      title: 'Study Groups',
      description: 'Discover and join active study groups across your campus.',
      icon: '👥',
      to: '/study-groups',
      cta: 'Browse Groups',
    },
    {
      title: 'Resources',
      description: 'Upload notes, slides, and materials for your peers.',
      icon: '📚',
      to: '/resources',
      cta: 'Explore Resources',
    },
    {
      title: 'Profile',
      description: 'Update your profile and see your contribution stats.',
      icon: '👤',
      to: '/profile',
      cta: 'View Profile',
    },
  ];

  const statsList = [
    {
      label: 'Groups Joined',
      value: stats.groupsJoined,
    },
    {
      label: 'Groups Created',
      value: stats.groupsCreated,
    },
    {
      label: 'Resources Uploaded',
      value: stats.resourcesUploaded,
    },
  ];

  return (
    <DashboardLayout
      title={`Welcome back, ${user.name || user.fullName || 'Student'}!`}
      description="Here’s a quick overview of your activity and shortcuts to the most important areas of PeerNova."
    >
      <div className="space-y-8">
        {/* Stats row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsList.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#1a1a1a] bg-[#111111] px-4 py-3"
            >
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Quick links */}
        <section>
          <h2 className="text-sm font-semibold text-white mb-3">
            Get started
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group block rounded-xl border border-[#1a1a1a] bg-[#111111] p-5 hover:border-[#333333] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-1 text-base">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs mb-4">
                  {item.description}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="group-hover:bg-white group-hover:text-black"
                >
                  {item.cta}
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
