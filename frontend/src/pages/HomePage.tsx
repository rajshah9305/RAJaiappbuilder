import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Zap,
  Code,
  TestTube,
  Database,
  ArrowRight,
  Sparkles,
  Shield,
  Rocket,
  Users,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Globe,
  Cpu,
  Layers,
  Palette,
  Smartphone,
  Cloud,
  Lock,
  GitBranch,
  Zap as ZapIcon,
  Play
} from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Generation',
      description: 'Convert natural language descriptions into fully functional web applications using advanced AI models.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100'
    },
    {
      icon: Code,
      title: 'Multi-Agent Architecture',
      description: 'Specialized AI agents work together: Architect, Frontend Developer, Backend Developer, Tester, and Reviewer.',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100'
    },
    {
      icon: TestTube,
      title: 'Self-Healing Code',
      description: 'Automatic error detection and repair with intelligent debugging and optimization.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Database,
      title: 'Secure Sandboxing',
      description: 'Isolated container environments for safe code execution and testing.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Built-in security features, compliance checks, and audit logging.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Rocket,
      title: 'One-Click Deployment',
      description: 'Deploy your generated applications to Vercel, AWS, or any cloud platform.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Apps Generated', value: '50,000+', icon: Code },
    { label: 'Success Rate', value: '95%', icon: CheckCircle },
    { label: 'Avg. Generation Time', value: '2.5 min', icon: Clock }
  ]

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Navigation */}
      <nav className="relative z-10 glass-morphism border-b border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center animate-pulse-gentle">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CodeNova</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-8"
            >
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#showcase" className="text-white/80 hover:text-white transition-colors">Showcase</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <Link to="/generate" className="btn btn-primary">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full glass-morphism text-white/90 text-sm font-semibold mb-8 animate-bounce-gentle">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                #1 AI-Powered Development Platform
                <Award className="w-4 h-4 ml-2 text-yellow-400" />
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="block text-white animate-fade-in">Build the</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 animate-gradient-x">
                  Future
                </span>
                <span className="block text-white animate-slide-up">Today</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in delay-300">
                Transform natural language into production-ready applications using our revolutionary
                AI-powered platform. From concept to deployment in minutes, not months.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/generate"
                className="group btn btn-xl animate-glow hover:scale-110 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3 animate-pulse-gentle" />
                Start Creating Now
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center space-x-4 text-white/60">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 border-2 border-white/20 animate-float" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <span className="text-sm">Join 50,000+ developers</span>
              </div>
            </motion.div>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            >
              {[
                { label: 'Apps Generated', value: '127K+', icon: Code, trend: '+12%' },
                { label: 'Active Users', value: '50K+', icon: Users, trend: '+8%' },
                { label: 'Success Rate', value: '99.2%', icon: CheckCircle, trend: '+0.3%' },
                { label: 'Avg. Time', value: '2.3min', icon: Clock, trend: '-15%' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="glass-morphism rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4 mx-auto">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm mb-2">{stat.label}</div>
                  <div className="flex items-center text-green-400 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-primary-400/10 to-accent-400/10 rounded-full blur-2xl animate-pulse-gentle"></div>
        </div>
      </section>

      {/* Elite Features Showcase */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="text-white">Revolutionary</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400">
                AI Technology
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the next evolution in software development with our cutting-edge AI agents
              that understand, create, and perfect your applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Cpu,
                title: 'Multi-Agent Intelligence',
                description: 'Specialized AI agents work in harmony: Architect, Frontend Developer, Backend Developer, Tester, and Reviewer.',
                color: 'from-blue-500 to-purple-500',
                delay: 0
              },
              {
                icon: ZapIcon,
                title: 'Lightning Fast',
                description: 'Generate complete applications in under 3 minutes with optimized AI processing and caching.',
                color: 'from-yellow-400 to-orange-500',
                delay: 0.1
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-grade security with isolated sandboxes, compliance checking, and audit trails.',
                color: 'from-green-400 to-emerald-500',
                delay: 0.2
              },
              {
                icon: GitBranch,
                title: 'Self-Healing Code',
                description: 'Automatic error detection and repair with intelligent debugging and optimization.',
                color: 'from-pink-500 to-rose-500',
                delay: 0.3
              },
              {
                icon: Layers,
                title: 'Framework Agnostic',
                description: 'Support for React, Vue, Angular, Svelte, and any modern framework you prefer.',
                color: 'from-indigo-500 to-blue-500',
                delay: 0.4
              },
              {
                icon: Globe,
                title: 'One-Click Deploy',
                description: 'Deploy to Vercel, Netlify, AWS, or any platform with automated CI/CD pipelines.',
                color: 'from-cyan-400 to-blue-500',
                delay: 0.5
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                className="group card-glass hover-lift"
              >
                <div className="card-header text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="showcase" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="text-white">See It In</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400">
                Action
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Watch as our AI transforms simple text descriptions into beautiful, functional applications
              in real-time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="card-glass p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Live Generation</span>
                </div>
                <div className="space-y-3 text-white/80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Analyzing requirements...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Generating components...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Writing business logic...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Adding tests...</span>
                  </div>
                </div>
              </div>

              <div className="card-glass p-8">
                <h3 className="text-white font-bold mb-4">Example Prompt:</h3>
                <p className="text-white/80 mb-4">
                  "Create a modern task management app with drag-and-drop kanban board,
                  real-time collaboration, and team assignment features."
                </p>
                <div className="flex items-center space-x-4">
                  <button className="btn btn-primary">
                    <Play className="w-4 h-4 mr-2" />
                    Generate Now
                  </button>
                  <span className="text-white/60 text-sm">⏱️ ~2.5 minutes</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="card-glass p-8"
            >
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                    <Code className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Interactive Preview</h3>
                  <p className="text-white/60">Your generated app will appear here</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-white/70">
              Join thousands of developers and companies worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'TechCorp', users: '10,000+', logo: 'TC' },
              { name: 'DevStudio', users: '25,000+', logo: 'DS' },
              { name: 'CodeWorks', users: '8,500+', logo: 'CW' },
              { name: 'BuildFast', users: '15,000+', logo: 'BF' }
            ].map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-morphism rounded-xl p-6 text-center hover-lift"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  {company.logo}
                </div>
                <h3 className="font-bold text-white mb-1">{company.name}</h3>
                <p className="text-white/60 text-sm">{company.users} users</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-accent-900/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-morphism text-white/90 text-sm font-semibold mb-8">
              <Rocket className="w-4 h-4 mr-2" />
              Start Your Journey Today
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Revolutionize</span> Your
              <span className="block text-white">Development Workflow?</span>
            </h2>

            <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the AI-powered development revolution. Create, collaborate, and deploy
              faster than ever before.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/generate"
                className="group btn btn-xl animate-glow hover:scale-110 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                Start Building Free
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/dashboard"
                className="btn btn-secondary btn-xl"
              >
                View Dashboard
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-white/60 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Free to start
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                Deploy in minutes
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
