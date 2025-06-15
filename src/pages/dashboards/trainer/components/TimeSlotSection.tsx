import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Trash2, Edit, Save, X } from 'lucide-react';
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
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ start_time: string; end_time: string }>({
    start_time: '',
    end_time: ''
  });
  const { toast } = useToast();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (trainerId) {
      fetchTimeSlots();
    }
  }, [trainerId]);

  const fetchTimeSlots = async () => {
    try {
      console.log('TimeSlotSection: Fetching time slots for trainer profile ID:', trainerId);
      
      // First verify this trainer profile exists
      const { data: trainerProfile, error: profileError } = await supabase
        .from('trainer_profiles')
        .select('id, user_id, full_name')
        .eq('id', trainerId)
        .single();

      if (profileError) {
        console.error('TimeSlotSection: Error fetching trainer profile:', profileError);
        throw new Error('Trainer profile not found');
      }

      console.log('TimeSlotSection: Trainer profile found:', trainerProfile);

      const { data, error } = await supabase
        .from('trainer_time_slots')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('day_of_week', { ascending: true });

      if (error) {
        console.error('TimeSlotSection: Error fetching time slots:', error);
        throw error;
      }
      
      console.log('TimeSlotSection: Fetched time slots for trainer ID', trainerId, ':', data);
      setTimeSlots(data || []);
    } catch (error: any) {
      console.error('TimeSlotSection: Error in fetchTimeSlots:', error);
      toast({
        title: "Error",
        description: `Failed to fetch time slots: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async (dayOfWeek: number) => {
    try {
      console.log('TimeSlotSection: Adding time slot for trainer profile ID:', trainerId, 'Day:', dayOfWeek);
      
      const newSlot = {
        trainer_id: trainerId, // This should be the trainer_profiles.id
        day_of_week: dayOfWeek,
        start_time: '09:00',
        end_time: '10:00',
        is_available: true
      };

      console.log('TimeSlotSection: Inserting new slot:', newSlot);

      const { data, error } = await supabase
        .from('trainer_time_slots')
        .insert(newSlot)
        .select()
        .single();

      if (error) {
        console.error('TimeSlotSection: Error adding time slot:', error);
        throw error;
      }
      
      console.log('TimeSlotSection: Successfully added time slot:', data);
      fetchTimeSlots();
      toast({
        title: "Success",
        description: "Time slot added successfully"
      });
    } catch (error: any) {
      console.error('TimeSlotSection: Error adding time slot:', error);
      toast({
        title: "Error",
        description: `Failed to add time slot: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const deleteTimeSlot = async (slotId: string) => {
    try {
      console.log('Deleting time slot:', slotId);
      
      const { error } = await supabase
        .from('trainer_time_slots')
        .delete()
        .eq('id', slotId);

      if (error) {
        console.error('Error deleting time slot:', error);
        throw error;
      }
      
      console.log('Successfully deleted time slot');
      fetchTimeSlots();
      toast({
        title: "Success",
        description: "Time slot deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting time slot:', error);
      toast({
        title: "Error",
        description: `Failed to delete time slot: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const startEditing = (slot: TimeSlot) => {
    setEditingSlot(slot.id);
    setEditValues({
      start_time: slot.start_time,
      end_time: slot.end_time
    });
  };

  const cancelEditing = () => {
    setEditingSlot(null);
    setEditValues({ start_time: '', end_time: '' });
  };

  const saveTimeSlot = async (slotId: string) => {
    try {
      console.log('Updating time slot:', slotId, editValues);
      
      const { error } = await supabase
        .from('trainer_time_slots')
        .update({
          start_time: editValues.start_time,
          end_time: editValues.end_time
        })
        .eq('id', slotId);

      if (error) {
        console.error('Error updating time slot:', error);
        throw error;
      }
      
      console.log('Successfully updated time slot');
      setEditingSlot(null);
      fetchTimeSlots();
      toast({
        title: "Success",
        description: "Time slot updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating time slot:', error);
      toast({
        title: "Error",
        description: `Failed to update time slot: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const toggleAvailability = async (slot: TimeSlot) => {
    try {
      console.log('Toggling availability for slot:', slot.id);
      
      const { error } = await supabase
        .from('trainer_time_slots')
        .update({ is_available: !slot.is_available })
        .eq('id', slot.id);

      if (error) {
        console.error('Error toggling availability:', error);
        throw error;
      }
      
      console.log('Successfully toggled availability');
      fetchTimeSlots();
      toast({
        title: "Success",
        description: `Time slot marked as ${!slot.is_available ? 'available' : 'unavailable'}`
      });
    } catch (error: any) {
      console.error('Error toggling availability:', error);
      toast({
        title: "Error",
        description: `Failed to update availability: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const getSlotsByDay = (dayOfWeek: number) => {
    return timeSlots.filter(slot => slot.day_of_week === dayOfWeek);
  };

  if (!trainerId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading trainer information...</p>
        </CardContent>
      </Card>
    );
  }

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
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading time slots...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {days.map((day, dayIndex) => (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{day}</h3>
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
                      <p className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded">
                        No time slots available for {day}
                      </p>
                    ) : (
                      getSlotsByDay(dayIndex).map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            
                            {editingSlot === slot.id ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="time"
                                  value={editValues.start_time}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, start_time: e.target.value }))}
                                  className="w-24 h-8"
                                />
                                <span className="text-sm">to</span>
                                <Input
                                  type="time"
                                  value={editValues.end_time}
                                  onChange={(e) => setEditValues(prev => ({ ...prev, end_time: e.target.value }))}
                                  className="w-24 h-8"
                                />
                              </div>
                            ) : (
                              <span className="text-sm font-medium">
                                {slot.start_time} - {slot.end_time}
                              </span>
                            )}
                            
                            <Badge 
                              variant={slot.is_available ? "default" : "secondary"}
                              className="text-xs cursor-pointer"
                              onClick={() => toggleAvailability(slot)}
                            >
                              {slot.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {editingSlot === slot.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => saveTimeSlot(slot.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditing}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(slot)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteTimeSlot(slot.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
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
