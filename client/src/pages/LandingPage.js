import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaRobot, FaMedal, FaLock } from 'react-icons/fa';
import { HiOutlineSparkles } from 'react-icons/hi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [isVisible, setIsVisible] = useState({});
  
  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionId = section.getAttribute('id');
        
        if (sectionTop < window.innerHeight * 0.75) {
          setIsVisible(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Login function that redirects to the login page
  const handleLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="landing-page bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HiOutlineSparkles className="inline-block text-6xl text-accent-400 mb-4" />
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
            Centsi
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-8 text-primary-300">
            Your AI Finance Coach for Students
          </p>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-10">
            Master your finances, achieve your goals, and build wealth with personalized AI coaching.
            All while earning rewards and having fun!
          </p>
          
          <motion.button
            onClick={handleLogin}
            className="bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
          
          <p className="text-sm text-gray-400 mt-4">
            No credit card required. Start your financial journey today.
          </p>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center items-start p-1"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-1 h-2 rounded-full bg-gray-300"></div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
            Features That Empower You
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<FaRobot className="text-4xl text-accent-400" />}
              title="AI Financial Coach"
              description="Get personalized advice, answer financial questions, and receive guidance tailored to your unique situation."
              id="feature-1"
              isVisible={isVisible}
            />
            
            <FeatureCard 
              icon={<FaChartLine className="text-4xl text-primary-400" />}
              title="Smart Budgeting"
              description="Track your spending, set goals, and visualize your progress with intuitive charts and analysis."
              id="feature-2"
              isVisible={isVisible}
            />
            
            <FeatureCard 
              icon={<FaMedal className="text-4xl text-secondary-400" />}
              title="Gamified Learning"
              description="Earn XP, unlock achievements, and level up as you improve your financial habits and knowledge."
              id="feature-3"
              isVisible={isVisible}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 bg-dark-700 bg-opacity-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
            How Centsi Works
          </h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              id="how-it-works-1"
              className="animate-on-scroll"
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible['how-it-works-1'] ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-secondary-800 to-dark-800 p-1 rounded-2xl shadow-xl">
                <div className="bg-dark-800 rounded-2xl p-6 h-full">
                  <h3 className="text-2xl font-bold mb-4 text-accent-400">1. Connect with Centsi</h3>
                  <p className="text-gray-300 mb-4">
                    Talk to your AI financial coach through text or voice. Ask questions, get advice, or request financial tips.
                  </p>
                  <p className="text-gray-300">
                    Centsi uses advanced AI to understand your unique financial situation and goals.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              id="how-it-works-2"
              className="animate-on-scroll"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible['how-it-works-2'] ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-dark-800 to-secondary-800 p-1 rounded-2xl shadow-xl">
                <div className="bg-dark-800 rounded-2xl p-6 h-full">
                  <h3 className="text-2xl font-bold mb-4 text-primary-400">2. Set Goals & Track Progress</h3>
                  <p className="text-gray-300 mb-4">
                    Create savings goals for things that matter to you. Visualize your progress and celebrate milestones.
                  </p>
                  <p className="text-gray-300">
                    Centsi helps you stay motivated with real-time tracking and achievement rewards.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              id="how-it-works-3"
              className="animate-on-scroll"
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible['how-it-works-3'] ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-secondary-800 to-dark-800 p-1 rounded-2xl shadow-xl">
                <div className="bg-dark-800 rounded-2xl p-6 h-full">
                  <h3 className="text-2xl font-bold mb-4 text-accent-400">3. Learn & Earn</h3>
                  <p className="text-gray-300 mb-4">
                    Complete financial challenges, quizzes, and tasks to earn XP and level up your financial knowledge.
                  </p>
                  <p className="text-gray-300">
                    Unlock achievements and watch your financial literacy grow alongside your savings.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              id="how-it-works-4"
              className="animate-on-scroll"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible['how-it-works-4'] ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-dark-800 to-secondary-800 p-1 rounded-2xl shadow-xl">
                <div className="bg-dark-800 rounded-2xl p-6 h-full">
                  <h3 className="text-2xl font-bold mb-4 text-primary-400">4. Build Wealth</h3>
                  <p className="text-gray-300 mb-4">
                    Graduate from basic budgeting to smart investing with personalized recommendations.
                  </p>
                  <p className="text-gray-300">
                    Watch your financial future take shape as you make smarter decisions with Centsi's guidance.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            id="cta-section"
            className="animate-on-scroll"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible['cta-section'] ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
              Ready to Transform Your Finances?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of students who are mastering their finances and building wealth with Centsi.
            </p>
            
            <motion.button
              onClick={handleLogin}
              className="bg-gradient-to-r from-accent-500 to-secondary-500 hover:from-accent-600 hover:to-secondary-600 text-white font-bold py-3 px-10 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLock className="inline-block mr-2" /> Get Started Now
            </motion.button>
            
            <p className="text-sm text-gray-400 mt-4">
              Your financial future starts with a single step.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                Centsi
              </h2>
              <p className="text-gray-400">Your AI Finance Coach for Students</p>
            </div>
            
            <div className="flex space-x-4">
              <FooterLink href="#" text="About" />
              <FooterLink href="#" text="Privacy" />
              <FooterLink href="#" text="Terms" />
              <FooterLink href="#" text="Contact" />
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Centsi. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for students worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, id, isVisible }) => (
  <motion.div 
    id={id}
    className="animate-on-scroll bg-dark-700 rounded-xl p-6 hover:bg-dark-600 transition-colors border border-dark-500 shadow-xl"
    initial={{ opacity: 0, y: 30 }}
    animate={isVisible[id] ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.5 }}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

// Footer Link Component
const FooterLink = ({ href, text }) => (
  <a 
    href={href} 
    className="text-gray-400 hover:text-accent-400 transition-colors"
  >
    {text}
  </a>
);

export default LandingPage;