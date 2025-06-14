
-- Enable Row Level Security on trainer_time_slots table
ALTER TABLE public.trainer_time_slots ENABLE ROW LEVEL SECURITY;

-- Create policy that allows trainers to view their own time slots
CREATE POLICY "Trainers can view their own time slots" 
  ON public.trainer_time_slots 
  FOR SELECT 
  USING (
    trainer_id IN (
      SELECT id FROM public.trainer_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create policy that allows trainers to insert their own time slots
CREATE POLICY "Trainers can create their own time slots" 
  ON public.trainer_time_slots 
  FOR INSERT 
  WITH CHECK (
    trainer_id IN (
      SELECT id FROM public.trainer_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create policy that allows trainers to update their own time slots
CREATE POLICY "Trainers can update their own time slots" 
  ON public.trainer_time_slots 
  FOR UPDATE 
  USING (
    trainer_id IN (
      SELECT id FROM public.trainer_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Create policy that allows trainers to delete their own time slots
CREATE POLICY "Trainers can delete their own time slots" 
  ON public.trainer_time_slots 
  FOR DELETE 
  USING (
    trainer_id IN (
      SELECT id FROM public.trainer_profiles 
      WHERE user_id = auth.uid()
    )
  );
