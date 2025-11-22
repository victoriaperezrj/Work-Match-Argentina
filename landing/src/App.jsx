import InteractiveParticles from './components/InteractiveParticles';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Particle System Background */}
      <InteractiveParticles />

      {/* Main Content */}
      <Hero />

      {/* Grid overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none"
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
