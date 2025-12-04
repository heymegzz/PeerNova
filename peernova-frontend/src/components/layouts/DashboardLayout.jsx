import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import PageHeader from '../common/PageHeader';

function DashboardLayout({ children, title, description, actions }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader title={title} description={description} actions={actions} />
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardLayout;


