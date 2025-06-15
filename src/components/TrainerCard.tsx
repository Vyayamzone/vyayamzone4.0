
import React from 'react';
import { Star } from 'lucide-react';

interface TrainerCardProps {
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  onViewProfile?: () => void;
}

const TrainerCard = ({ name, specialty, rating, experience, image, onViewProfile }: TrainerCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{name}</h3>
        <p className="text-teal-600 font-medium mb-3">{specialty}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-slate-600 ml-2">{rating}.0</span>
          </div>
          <span className="text-sm text-slate-500">{experience}</span>
        </div>
        
        <button 
          onClick={onViewProfile}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium py-2 px-4 rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TrainerCard;
