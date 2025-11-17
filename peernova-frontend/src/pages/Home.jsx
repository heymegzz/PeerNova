import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

function Home() {
  const features = [
    {
      icon: '💬',
      title: 'Community Feed',
      description: 'Share posts, updates, and questions with your campus community in real-time.'
    },
    {
      icon: '👥',
      title: 'Study Groups',
      description: 'Form and join subject-based or interest-based study groups easily.'
    },
    {
      icon: '📚',
      title: 'Resource Library',
      description: 'Share and discover notes, PDFs, and study materials from peers.'
    },
    {
      icon: '🎉',
      title: 'Event Hub',
      description: 'Discover and attend campus events, hackathons, and workshops.'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find people, posts, and resources with advanced filtering and sorting.'
    },
    {
      icon: '⚡',
      title: 'Real-time Notifications',
      description: 'Get notified about group updates, events, and new resources instantly.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Students' },
    { number: '50+', label: 'Colleges' },
    { number: '100K+', label: 'Resources Shared' },
    { number: '1M+', label: 'Posts & Updates' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Navbar */}
      <Navbar isAuthenticated={false} />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 pt-12 pb-20 md:pt-16 md:pb-32">
        <div className="max-w-5xl mx-auto text-center space-y-10 w-full">
          {/* Badge */}
          <div className="inline-block">
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase px-4 py-2 bg-[#111111] rounded-full border border-[#1a1a1a]">
              ✨ Welcome to the Future of Campus Collaboration
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            <span className="text-white">Connect.</span>
            <br />
            <span className="text-gray-400">Collaborate.</span>
            <br />
            <span className="text-white">Succeed Together.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            PeerNova brings students together with a unified platform for sharing resources, forming study groups, discovering opportunities, and building meaningful connections within your campus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/signup" className="inline-block">
              <Button variant="primary" size="lg" fullWidth>
                Get Started Now
              </Button>
            </Link>
            <Link to="/login" className="inline-block">
              <Button variant="secondary" size="lg" fullWidth>
                Already a member?
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <span>✓ Secure & Private</span>
            <span>✓ No Spam</span>
            <span>✓ Free to Join</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-[#111111] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-3">
                  {stat.number}
                </p>
                <p className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">What Makes</span>{' '}
              <span className="text-gray-400">PeerNova</span>
              <span className="text-white"> Special</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to collaborate, learn, and grow with your campus community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-[#111111] border border-[#1a1a1a] rounded-xl hover:border-[#333333] transition-all duration-300 group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-3 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-[#111111] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-20">
            Get Started in 3 Easy Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up with your email and create your student profile in seconds.'
              },
              {
                step: '2',
                title: 'Join Your Community',
                description: 'Connect with peers, join study groups, and explore events.'
              },
              {
                step: '3',
                title: 'Start Collaborating',
                description: 'Share resources, ask questions, and grow together with your campus.'
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 border-t border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="text-white">Ready to join the</span>{' '}
            <span className="text-gray-400">PeerNova</span>
            <span className="text-white"> community?</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl">
            Start connecting with peers, sharing resources, and discovering amazing opportunities today.
          </p>
          <Link to="/signup" className="inline-block">
            <Button variant="primary" size="lg">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
