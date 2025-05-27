
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface TimeSlotSectionProps {
  trainerId: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimeSlotSection = ({ trainerId }: TimeSlotSectionProps) => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:00'
  });

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
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async () => {
    setAdding(true);
    try {
      const { error } = await supabase
        .from('trainer_time_slots')
        .insert({
          trainer_id: trainerId,
          day_of_week: newSlot.day_of_week,
          start_time: newSlot.start_time,
          end_time: newSlot.end_time,
          is_available: true
        });

      if (error) throw error;

      toast({
        title: "Time Slot Added",
        description: "Your availability has been updated.",
      });

      fetchTimeSlots();
      setNewSlot({ day_of_week: 1, start_time: '09:00', end_time: '10:00' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('trainer_time_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast({
        title: "Time Slot Deleted",
        description: "The time slot has been removed.",
      });

      fetchTimeSlots();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleAvailability = async (slotId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('trainer_time_slots')
        .update({ is_available: !currentStatus })
        .eq('id', slotId);

      if (error) throw error;

      fetchTimeSlots();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading availability...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Add New Time Slot
          </CardTitle>
          <CardDescription>Set your available hours for training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Day</Label>
              <select
                value={newSlot.day_of_week}
                onChange={(e) => setNewSlot({ ...newSlot, day_of_week: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-md"
              >
                {DAYS.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addTimeSlot} disabled={adding} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
          <CardDescription>Manage your weekly schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {timeSlots.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No time slots set. Add your first availability above.</p>
          ) : (
            <div className="space-y-4">
              {DAYS.map((day, dayIndex) => {
                const daySlots = timeSlots.filter(slot => slot.day_of_week === dayIndex);
                return (
                  <div key={dayIndex} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
                    {daySlots.length === 0 ? (
                      <p className="text-gray-500 text-sm">No availability set</p>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium">
                                {slot.start_time} - {slot.end_time}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                slot.is_available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {slot.is_available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAvailability(slot.id, slot.is_available)}
                              >
                                {slot.is_available ? 'Disable' : 'Enable'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteTimeSlot(slot.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotSection;
