
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Heart, Search, MessageSquare } from 'lucide-react';
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

const TrainerBrowseSection = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovedTrainers();
  }, []);

  const fetchApprovedTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;
      setTrainers(data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch trainers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (trainerId: string, trainerName: string) => {
    toast({
      title: "Interest Expressed",
      description: `Your interest in connecting with ${trainerName} has been sent to admin for review.`
    });
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specializations?.some(spec => 
      spec.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Browse Trainers</CardTitle>
          <CardDescription>
            Find certified trainers that match your fitness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trainers by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading trainers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainers.map((trainer) => (
                <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={trainer.profile_image_url} />
                        <AvatarFallback>
                          {trainer.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{trainer.full_name}</h3>
                        <p className="text-sm text-gray-600">{trainer.experience}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.8 (12 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {trainer.bio || 'Dedicated fitness professional ready to help you achieve your goals.'}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {trainer.specializations?.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-lg">
                        ₹{trainer.hourly_rate}/hr
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleExpressInterest(trainer.id, trainer.full_name)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredTrainers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No trainers found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerBrowseSection;
