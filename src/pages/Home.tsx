
import React from 'react';
import Layout from '../components/Layout';
import TrainerCard from '../components/TrainerCard';
import { ArrowRight, Users, Award, Clock, Heart } from 'lucide-react';

const Home = () => {
  const trainers = [
    {
      name: "Sarah Johnson",
      specialty: "Yoga & Meditation",
      rating: 5,
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1506629905587-4b9d64d8c5a7?w=400&h=300&fit=crop"
    },
    {
      name: "Mike Rodriguez",
      specialty: "Personal Training",
      rating: 5,
      experience: "6+ years",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
      name: "Emma Chen",
      specialty: "Zumba & Dance",
      rating: 4,
      experience: "5+ years",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop"
    }
  ];

  const stats = [
    { icon: Users, number: "500+", label: "Active Trainers" },
    { icon: Heart, number: "10K+", label: "Happy Clients" },
    { icon: Award, number: "95%", label: "Success Rate" },
    { icon: Clock, number: "24/7", label: "Support" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              <button className="w-full sm:w-auto group bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2">
                <span>Find a Trainer</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>
              
              <button className="w-full sm:w-auto group bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Join as Trainer</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced 3D Floating Elements */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-teal-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-4 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 bg-lime-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 sm:bottom-1/4 left-1/4 w-20 h-20 sm:w-32 sm:h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* 3D Geometric Shapes */}
        <div className="absolute top-1/3 left-1/4 hidden sm:block">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400/30 to-teal-600/30 transform rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/4 hidden sm:block">
          <div className="w-20 h-20 bg-gradient-to-br from-lime-400/30 to-lime-600/30 rounded-full transform animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        </div>
        
        {/* 3D Card-like Elements */}
        <div className="absolute top-1/2 left-8 hidden lg:block transform -rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="w-24 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl transform perspective-1000 rotateY-15"></div>
        </div>
        
        <div className="absolute top-1/3 right-8 hidden lg:block transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <div className="w-28 h-36 bg-gradient-to-br from-teal-500/20 to-teal-700/20 backdrop-blur-sm border border-teal-400/30 rounded-lg shadow-2xl transform perspective-1000 rotateY-15"></div>
        </div>
        
        {/* Mobile-friendly floating icons */}
        <div className="absolute top-16 right-4 sm:hidden">
          <div className="w-8 h-8 bg-teal-400/40 rounded-full flex items-center justify-center animate-bounce">
            <Heart className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="absolute bottom-32 left-4 sm:hidden">
          <div className="w-8 h-8 bg-lime-400/40 rounded-full flex items-center justify-center animate-pulse">
            <Award className="w-4 h-4 text-white" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {trainers.map((trainer, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <TrainerCard {...trainer} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              View All Trainers
            </button>
          </div>
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
    </Layout>
  );
};

export default Home;
