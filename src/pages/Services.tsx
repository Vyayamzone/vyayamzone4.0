
import React from 'react';
import Layout from '../components/Layout';
import { Dumbbell, Heart, Users, Stethoscope, Brain, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Dumbbell,
      title: "Personal Fitness Training",
      description: "One-on-one training sessions tailored to your fitness level and goals. Build strength, endurance, and achieve your dream physique.",
      features: ["Customized workout plans", "Progress tracking", "Nutrition guidance", "Flexible scheduling"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Heart,
      title: "Yoga & Meditation",
      description: "Find inner peace and flexibility with certified yoga instructors. Perfect for stress relief and spiritual wellness.",
      features: ["Hatha & Vinyasa styles", "Meditation sessions", "Breathing techniques", "Mind-body connection"],
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Users,
      title: "Zumba & Dance Classes",
      description: "High-energy dance fitness classes that make working out fun. Burn calories while learning exciting dance moves.",
      features: ["Group & private classes", "Multiple dance styles", "Cardio focused", "Beginner friendly"],
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Stethoscope,
      title: "Physiotherapy",
      description: "Professional physiotherapy services for injury recovery and prevention. Get back to your active lifestyle safely.",
      features: ["Injury rehabilitation", "Pain management", "Mobility improvement", "Post-surgery recovery"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Brain,
      title: "Mental Wellness Sessions",
      description: "Holistic approach to mental health through counseling and wellness coaching. Achieve balance in mind and body.",
      features: ["Stress management", "Life coaching", "Mindfulness training", "Emotional support"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
              Comprehensive wellness solutions designed to help you achieve your health and fitness goals.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl mb-6`}>
                    <service.icon className="text-white" size={32} />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                    {service.title}
                  </h2>
                  
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`group bg-gradient-to-r ${service.color} text-white font-medium py-3 px-6 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2`}>
                    <span>Find a Trainer</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                  </button>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} relative`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src={`https://images.unsplash.com/photo-${index === 0 ? '1571019613454-1cb2f99b2d8b' : index === 1 ? '1506629905587-4b9d64d8c5a7' : index === 2 ? '1544005313-94ddf0286df2' : index === 3 ? '1559757148-5c350d0d3c56' : '1507003211169-0a1dd7a038cc'}?w=600&h=400&fit=crop`}
                      alt={service.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`}></div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500 rounded-2xl opacity-20"></div>
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-lime-400 rounded-full opacity-30"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Choose the service that best fits your needs and connect with certified trainers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-teal-600 font-bold py-4 px-8 rounded-full hover:bg-slate-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Browse All Trainers
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-full hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
