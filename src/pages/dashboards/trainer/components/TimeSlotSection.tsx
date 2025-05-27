
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimeSlotSectionProps {
  trainerId: string;
}

interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const TimeSlotSection: React.FC<TimeSlotSectionProps> = ({ trainerId }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (trainerId) {
      fetchTimeSlots();
    }
  }, [trainerId]);

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_time_slots')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      toast({
        title: "Error",
        description: "Failed to fetch time slots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async (dayOfWeek: number) => {
    try {
      const newSlot = {
        trainer_id: trainerId,
        day_of_week: dayOfWeek,
        start_time: '09:00',
        end_time: '10:00',
        is_available: true
      };

      const { error } = await supabase
        .from('trainer_time_slots')
        .insert(newSlot);

      if (error) throw error;
      
      fetchTimeSlots();
      toast({
        title: "Success",
        description: "Time slot added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('trainer_time_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
      
      fetchTimeSlots();
      toast({
        title: "Success",
        description: "Time slot deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getSlotsByDay = (dayOfWeek: number) => {
    return timeSlots.filter(slot => slot.day_of_week === dayOfWeek);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Slot Management</CardTitle>
          <CardDescription>
            Manage your available time slots for training sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading time slots...</div>
          ) : (
            <div className="space-y-6">
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{day}</h3>
                    <Button
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Slot
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {getSlotsByDay(dayIndex).length === 0 ? (
                      <p className="text-gray-500 text-sm">No time slots available</p>
                    ) : (
                      getSlotsByDay(dayIndex).map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {slot.start_time} - {slot.end_time}
                            </span>
                            <Badge 
                              variant={slot.is_available ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {slot.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTimeSlot(slot.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotSection;
