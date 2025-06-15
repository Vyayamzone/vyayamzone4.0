
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, Award, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface TrainerDetailDialogProps {
  trainer: Trainer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrainerDetailDialog = ({ trainer, open, onOpenChange }: TrainerDetailDialogProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (trainer && open) {
      fetchTrainerTimeSlots();
    }
  }, [trainer, open]);

  const fetchTrainerTimeSlots = async () => {
    if (!trainer) return;
    
    setLoading(true);
    console.log('Fetching time slots for trainer profile ID:', trainer.id);
    
    try {
      const { data: trainerProfile, error: profileError } = await supabase
        .from('trainer_profiles')
        .select('id, user_id, full_name')
        .eq('id', trainer.id)
        .single();

      if (profileError) {
        console.error('Error fetching trainer profile:', profileError);
        throw new Error('Trainer profile not found');
      }

      console.log('Trainer profile found:', trainerProfile);

      const { data, error } = await supabase
        .from('trainer_time_slots')
        .select('time_slots')
        .eq('trainer_id', trainer.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching time slots:', error);
        throw error;
      }
      
      console.log('Fetched time slots data for trainer ID', trainer.id, ':', data);
      
      if (data && data.time_slots) {
        setTimeSlots(Array.isArray(data.time_slots) ? data.time_slots : []);
      } else {
        setTimeSlots([]);
      }
      
      if (!data || !data.time_slots || data.time_slots.length === 0) {
        console.log('No time slots found for trainer ID:', trainer.id);
      }
    } catch (error) {
      console.error('Error in fetchTrainerTimeSlots:', error);
      toast({
        title: "Error",
        description: "Failed to load trainer's available time slots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = () => {
    toast({
      title: "Booking Request Sent",
      description: `Your booking request for ${trainer?.full_name} has been sent to admin for review.`
    });
    onOpenChange(false);
  };

  const availableSlots = timeSlots.filter(slot => slot.is_available);

  if (!trainer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Trainer Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Trainer Header */}
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={trainer.profile_image_url} />
              <AvatarFallback className="text-2xl">
                {trainer.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">{trainer.full_name}</h2>
              <p className="text-lg text-gray-600 mb-2">{trainer.experience}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-600">(12 reviews)</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ₹{trainer.hourly_rate}/hr
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trainer.specializations?.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    <Award className="h-3 w-3 mr-1" />
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {trainer.bio || 'This trainer is a dedicated fitness professional ready to help you achieve your goals with personalized training sessions.'}
              </p>
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Available Time Slots
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading available slots...</p>
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="space-y-4">
                  {dayNames.map((dayName, dayIndex) => {
                    const daySlots = availableSlots.filter(slot => slot.day_of_week === dayIndex);
                    
                    if (daySlots.length === 0) return null;
                    
                    return (
                      <div key={dayIndex} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-3 text-gray-800">{dayName}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {daySlots.map((slot) => (
                            <div key={slot.id} className="bg-green-50 border border-green-200 rounded-lg p-3 hover:bg-green-100 transition-colors cursor-pointer">
                              <div className="flex items-center text-green-700">
                                <Clock className="h-4 w-4 mr-2" />
                                <span className="font-medium">{slot.start_time} - {slot.end_time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No available time slots</p>
                  <p className="text-gray-400 text-sm">This trainer hasn't set up their availability yet</p>
                </div>
              )}
              
              {!loading && timeSlots.length > 0 && availableSlots.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                  <p className="text-orange-600 text-lg mb-2">All slots are currently unavailable</p>
                  <p className="text-orange-500 text-sm">Please check back later or contact the trainer directly</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <Button 
              onClick={handleBookSession}
              className="flex-1"
              size="lg"
              disabled={availableSlots.length === 0}
            >
              <Calendar className="h-5 w-5 mr-2" />
              {availableSlots.length > 0 ? 'Book Session' : 'No Slots Available'}
            </Button>
            <Button variant="outline" size="lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainerDetailDialog;
