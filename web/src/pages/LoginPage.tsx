import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  PieChart,
  TrendingUp,
  Wallet,
  Target,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import iconLogo from '../assets/icon-logo.svg';

interface LoginPageProps {
  onLogin: () => void;
}

const floatingCards = [
  {
    icon: PieChart,
    label: 'Budgets',
    sub: 'Track every category',
    rotate: -10,
    x: -520,
    y: 30,
  },
  {
    icon: TrendingUp,
    label: 'Spending',
    sub: 'Real-time insights',
    rotate: 8,
    x: 370,
    y: 10,
  },
  {
    icon: Target,
    label: 'Goals',
    sub: 'Save smarter',
    rotate: -5,
    x: -460,
    y: 260,
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    sub: 'Visual reports',
    rotate: 7,
    x: 390,
    y: 220,
  },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-screen shader gradient background */}
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          pixelDensity={1}
          fov={45}
        >
          <ShaderGradient
            animate="on"
            brightness={1.2}
            cAzimuthAngle={170}
            cDistance={4.4}
            cPolarAngle={70}
            cameraZoom={1}
            color1="#94ffd1"
            color2="#6bf5ff"
            color3="#ffffff"
            envPreset="lobby"
            grain="off"
            lightType="3d"
            positionX={0}
            positionY={0.9}
            positionZ={-0.3}
            range="enabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={45}
            rotationY={0}
            rotationZ={0}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0}
            uDensity={1.2}
            uFrequency={0}
            uSpeed={0.2}
            uStrength={3.4}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-8 py-5 md:px-16"
        >
          <div className="flex items-center gap-2.5">
            <img src={iconLogo} alt="FlowMint" className="h-8 w-8" />
            <span className="text-lg font-bold text-white drop-shadow-md">FlowMint</span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <span className="cursor-default transition-colors hover:text-white drop-shadow-sm">
              Features
            </span>
            <span className="cursor-default transition-colors hover:text-white drop-shadow-sm">
              How it works
            </span>
            <span className="cursor-default transition-colors hover:text-white drop-shadow-sm">
              Security
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onLogin}
            className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Get Started
          </motion.button>
        </motion.nav>

        {/* Hero section */}
        <div className="flex flex-1 flex-col items-center px-6 pt-6 md:pt-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl text-center text-5xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-7xl"
          >
            Master Your{' '}
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent drop-shadow-lg">
              Finances
            </span>
            !
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 max-w-lg text-center text-base leading-relaxed text-white/70 drop-shadow-sm md:text-lg"
          >
            Empowering your financial journey with
            <br />a beautifully simple, browser-first solution.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogin}
            className="mt-8 flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-shadow hover:shadow-[0_0_60px_rgba(255,255,255,0.35)]"
          >
            Continue as Guest
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-3 text-xs text-white/40 drop-shadow-sm"
          >
            No account needed — all data stays in your browser.
          </motion.p>

          {/* Phone mockup + floating cards */}
          <div className="relative mt-10 flex w-full max-w-4xl items-start justify-center md:mt-14">
            {/* Floating cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                animate={{
                  opacity: 1,
                  y: [0, -12, 0],
                  rotate: card.rotate,
                }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.6 + i * 0.12 },
                  rotate: { duration: 0.7, delay: 0.6 + i * 0.12 },
                  y: {
                    duration: 3 + i * 0.5,
                    delay: 0.6 + i * 0.12,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  },
                }}
                className="absolute z-20 hidden md:flex"
                style={{ left: `calc(50% + ${card.x}px)`, top: card.y }}
              >
                <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-black/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <card.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{card.label}</p>
                    <p className="text-sm text-white/50">{card.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Phone frame - tall, only top part visible */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-[300px] md:w-[340px]"
            >
              <div className="rounded-t-[2.8rem] border-[3px] border-b-0 border-white/15 bg-black/30 p-2.5 pt-2.5 shadow-[0_-10px_60px_rgba(0,0,0,0.3)] backdrop-blur-md">
                {/* Notch */}
                <div className="mx-auto mb-3 h-7 w-32 rounded-full bg-black/40" />

                {/* Screen */}
                <div className="rounded-t-[2.2rem] bg-[#0d1f14]/90 p-5 backdrop-blur-sm">
                  {/* Greeting */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#76DDAA] to-[#5BB88A]">
                        <span className="text-[9px] font-bold text-white">FM</span>
                      </div>
                      <span className="text-sm font-semibold text-white">Hi, Guest!</span>
                    </div>
                    <Wallet size={16} className="text-white/40" />
                  </div>

                  {/* Card */}
                  <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#76DDAA] to-[#4ECDC4] p-5">
                    <p className="text-[10px] font-semibold tracking-widest text-[#050d09]/50">
                      FLOWMINT
                    </p>
                    <p className="mt-3 text-xl font-bold tracking-[0.2em] text-[#050d09]">
                      •••• •••• •••• 4289
                    </p>
                    <div className="mt-4 flex justify-between text-[10px] text-[#050d09]/60">
                      <span>•••• •••• •••• 4289</span>
                      <span>03/28</span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-5">
                    <p className="text-[11px] text-white/40">Total Balance</p>
                    <p className="text-2xl font-bold text-white">$12,458.90</p>
                  </div>

                  {/* Transactions header */}
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-white/60">Transactions</p>
                    <p className="text-[10px] text-[#76DDAA]">View All</p>
                  </div>

                  {/* Transaction rows */}
                  <div className="space-y-2.5">
                    {[
                      { name: 'Grocery Store', amount: '-$84.50', icon: CreditCard, neg: true },
                      { name: 'Salary Deposit', amount: '+$3,200', icon: TrendingUp, neg: false },
                      { name: 'Electric Bill', amount: '-$124.00', icon: Wallet, neg: true },
                    ].map((tx) => (
                      <div
                        key={tx.name}
                        className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#76DDAA]/10">
                          <tx.icon size={14} className="text-[#76DDAA]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-medium text-white">{tx.name}</p>
                        </div>
                        <p
                          className={`text-[11px] font-semibold ${tx.neg ? 'text-red-400' : 'text-[#76DDAA]'}`}
                        >
                          {tx.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
