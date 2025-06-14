import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TrainerCard from '../components/TrainerCard';
import TrainerDetailDialog from '../pages/dashboards/user/components/TrainerDetailDialog';
import { ArrowRight, Users, Award, Clock, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Trainer {
  id: string;
  full_name: string;
  email: string;
  specializations: string[];
  experience: string;
  hourly_rate: number;
  bio: string;
  profile_image_url?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const stats = [
    { icon: Users, number: "500+", label: "Active Trainers" },
    { icon: Heart, number: "10K+", label: "Happy Clients" },
    { icon: Award, number: "95%", label: "Success Rate" },
    { icon: Clock, number: "24/7", label: "Support" }
  ];

  useEffect(() => {
    fetchApprovedTrainers();
  }, []);

  const fetchApprovedTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('status', 'approved')
        .limit(6); // Show first 6 trainers

      if (error) throw error;
      setTrainers(data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindTrainer = () => {
    navigate('/auth');
  };

  const handleJoinAsTrainer = () => {
    navigate('/dashboards/trainer/signup');
  };

  const handleViewProfile = (trainer: Trainer) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/auth');
      return;
    }
    
    setSelectedTrainer(trainer);
    setDialogOpen(true);
  };

  const handleViewAllTrainers = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/dashboards/user');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with improved mobile fitting */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 z-10"></div>
          
          {/* Background Image with better mobile positioning */}
          <div 
            className="absolute inset-0 bg-cover bg-center sm:bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop')",
              backgroundPosition: "center center",
              backgroundSize: "cover"
            }}
          ></div>
          
          {/* Enhanced overlay for better text readability on mobile */}
          <div className="absolute inset-0 bg-slate-900/70 sm:bg-slate-900/50 z-20"></div>
        </div>
        
        <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">
                Trainer
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Transform your fitness journey with VyayamZone's certified trainers. 
              From yoga to strength training, we've got your wellness covered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <button 
                onClick={handleFindTrainer}
                className="w-full sm:w-auto group bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Find a Trainer</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>
              
              <button 
                onClick={handleJoinAsTrainer}
                className="w-full sm:w-auto group bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Join as Trainer</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced 3D Floating Elements - Optimized for mobile */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-8 h-8 sm:w-20 sm:h-20 bg-teal-400/20 sm:bg-teal-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-4 sm:right-10 w-10 h-10 sm:w-24 sm:h-24 bg-lime-400/15 sm:bg-lime-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 sm:bottom-1/4 left-1/4 w-12 h-12 sm:w-32 sm:h-32 bg-purple-400/15 sm:bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* 3D Geometric Shapes - Hidden on mobile for cleaner look */}
        <div className="absolute top-1/3 left-1/4 hidden md:block">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-teal-400/30 to-teal-600/30 transform rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/4 hidden md:block">
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-lime-400/30 to-lime-600/30 rounded-full transform animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        </div>
        
        {/* 3D Card-like Elements - Hidden on mobile and tablet */}
        <div className="absolute top-1/2 left-8 hidden xl:block transform -rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="w-24 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl"></div>
        </div>
        
        <div className="absolute top-1/3 right-8 hidden xl:block transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="w-28 h-36 bg-gradient-to-br from-teal-500/20 to-teal-700/20 backdrop-blur-sm border border-teal-400/30 rounded-lg shadow-2xl"></div>
        </div>
        
        {/* Mobile-friendly floating icons - Better positioned */}
        <div className="absolute top-20 right-6 sm:hidden z-40">
          <div className="w-10 h-10 bg-teal-400/30 rounded-full flex items-center justify-center animate-bounce backdrop-blur-sm">
            <Heart className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="absolute bottom-40 left-6 sm:hidden z-40">
          <div className="w-10 h-10 bg-lime-400/30 rounded-full flex items-center justify-center animate-pulse backdrop-blur-sm">
            <Award className="w-5 h-5 text-white" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-white" size={window.innerWidth < 640 ? 20 : 24} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trainers */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 sm:mb-6">
              Meet Our Top Trainers
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
              Connect with certified professionals who are passionate about helping you achieve your fitness goals.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-slate-600">Loading trainers...</div>
            </div>
          ) : trainers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {trainers.map((trainer, index) => (
                  <div key={trainer.id} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                    <TrainerCard 
                      name={trainer.full_name}
                      specialty={trainer.specializations?.join(', ') || 'Fitness Training'}
                      rating={5}
                      experience={trainer.experience || 'Experienced Trainer'}
                      image={trainer.profile_image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'}
                      onViewProfile={() => handleViewProfile(trainer)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8 sm:mt-12">
                <button 
                  onClick={handleViewAllTrainers}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All Trainers
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-lg text-slate-600 mb-4">No approved trainers available at the moment.</div>
              <button 
                onClick={handleJoinAsTrainer}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 px-6 rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300"
              >
                Become a Trainer
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg sm:text-xl text-teal-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of others who have transformed their lives with VyayamZone. 
            Your perfect trainer is just a click away.
          </p>
          <button className="bg-white text-teal-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-slate-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </section>

      {/* Trainer Detail Dialog */}
      <TrainerDetailDialog
        trainer={selectedTrainer}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Layout>
  );
};

export default Home;
