import InteractiveParticles from './components/InteractiveParticles';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Particle System Background */}
      <InteractiveParticles />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>

        {/* Features Section */}
        <section id="features">
          <Features />
        </section>

        {/* Stats Section */}
        <Stats />

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorks />
        </section>

        {/* Final CTA Section */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Grid overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(66, 133, 244, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(66, 133, 244, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

export default App;
