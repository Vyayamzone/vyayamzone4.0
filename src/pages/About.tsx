
import React from 'react';
import Layout from '../components/Layout';
import { Target, Eye, Heart, Users } from 'lucide-react';

const About = () => {
  const founders = [
    {
      name: "Rajesh Kumar",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      bio: "Former fitness entrepreneur with 15+ years in the wellness industry."
    },
    {
      name: "Priya Sharma",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b27c?w=300&h=300&fit=crop",
      bio: "Tech innovator passionate about connecting people through technology."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Wellness First",
      description: "We prioritize holistic health and well-being in everything we do."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building a supportive community where everyone can thrive together."
    },
    {
      icon: Target,
      title: "Goal Oriented",
      description: "Helping you set, track, and achieve your personal fitness goals."
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
              About <span className="bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">VyayamZone</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
              Empowering your fitness journey through personalized training and wellness solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Target className="text-teal-600 mr-4" size={32} />
                  <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  To democratize access to quality fitness training by connecting individuals with 
                  certified trainers who understand their unique needs and goals. We believe everyone 
                  deserves personalized guidance on their wellness journey.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-6">
                  <Eye className="text-teal-600 mr-4" size={32} />
                  <h2 className="text-3xl font-bold text-slate-800">Our Vision</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  To create a world where fitness and wellness are accessible, enjoyable, and 
                  sustainable for everyone. We envision a future where technology bridges the gap 
                  between trainers and trainees, making healthy living a lifestyle, not a chore.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop" 
                alt="Team training outdoors"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-500 rounded-2xl opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-lime-400 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-800 text-center mb-12">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                VyayamZone was born from a simple observation: finding the right fitness trainer 
                shouldn't be complicated or expensive. Our founders, both fitness enthusiasts, 
                experienced firsthand the challenges of connecting with qualified trainers who 
                understood their specific needs.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                In 2023, they decided to create a platform that would revolutionize how people 
                approach fitness. By leveraging technology and focusing on personal connections, 
                VyayamZone bridges the gap between talented trainers and motivated individuals 
                seeking transformation.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Today, we're proud to serve thousands of users across multiple fitness disciplines, 
                from yoga and meditation to strength training and physiotherapy. Our community 
                continues to grow, united by a shared commitment to health, wellness, and personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-800 text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founders */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-slate-800 text-center mb-16">Meet the Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {founders.map((founder, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 w-48 h-48 rounded-full mx-auto bg-gradient-to-br from-teal-500/20 to-lime-400/20 group-hover:scale-105 transition-transform duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{founder.name}</h3>
                <p className="text-teal-600 font-medium mb-4">{founder.role}</p>
                <p className="text-slate-600 leading-relaxed">{founder.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
