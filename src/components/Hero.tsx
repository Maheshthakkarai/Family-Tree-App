import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Particles } from '@tsparticles/react';
import type { Container, Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { TreeDeciduous } from 'lucide-react';

interface HeroProps {
  onUnlock: () => void;
  familyName?: string;
}

const Hero: React.FC<HeroProps> = ({ onUnlock, familyName = "Legacy" }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1a1a1a] flex items-center justify-center font-sans">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: {
                enable: true,
              }
            },
            modes: {
              push: {
                quantity: 4,
              },
              grab: {
                distance: 200,
                links: {
                  opacity: 0.2
                }
              },
            },
          },
          particles: {
            color: {
              value: "#FFC107",
            },
            links: {
              color: "#FFC107",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                // area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0"
      />

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-8 py-12 glass rounded-[32px] mx-4"
      >
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#FFC107]/20 to-transparent border border-[#FFC107]/20"
          >
            <TreeDeciduous size={48} className="text-[#FFC107]" strokeWidth={1.5} />
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-display text-[#f8f8f8] mb-4">
            Welcome Home
          </h1>
          
          <p className="text-[#94a3b8] mb-10 font-sans tracking-wide">
            The <span className="text-[#FFC107] font-medium">{familyName} Archive</span>. <br />
            Please sign in to access our history.
          </p>

          {/* Form */}
          <div className="w-full space-y-6 mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC107] transition-colors"
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Security Key"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC107] transition-colors"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={onUnlock}
            className="w-full py-4 bg-[#FFC107] text-[#1a1a1a] font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Unlock the Vault
          </button>

          <p className="mt-8 text-xs text-white/30 uppercase tracking-[0.2em] font-medium">
            Confidential Archive
          </p>
        </div>
      </motion.div>

      {/* Subtle bottom text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/10 text-sm font-light italic">
          "A tree without roots is just wood."
        </p>
      </div>
    </div>
  );
};

export default Hero;
