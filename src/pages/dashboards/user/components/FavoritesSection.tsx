
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, MessageSquare, Trash2 } from 'lucide-react';

interface FavoriteTrainer {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  sessions: number;
  avatar?: string;
  hourlyRate: number;
}

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState<FavoriteTrainer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      specialization: 'Yoga & Meditation',
      rating: 4.9,
      sessions: 12,
      hourlyRate: 1500
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      specialization: 'Personal Training',
      rating: 4.8,
      sessions: 8,
      hourlyRate: 2000
    },
    {
      id: '3',
      name: 'Emma Chen',
      specialization: 'Zumba & Dance',
      rating: 4.7,
      sessions: 5,
      hourlyRate: 1200
    }
  ]);

  const removeFavorite = (trainerId: string) => {
    setFavorites(favorites.filter(trainer => trainer.id !== trainerId));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Favorite Trainers</CardTitle>
          <CardDescription>
            Your saved trainers for quick access and easy booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No favorite trainers yet</p>
              <p className="text-sm">Browse trainers and add them to your favorites</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((trainer) => (
                <Card key={trainer.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={trainer.avatar} />
                          <AvatarFallback>
                            {trainer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{trainer.name}</h3>
                          <p className="text-sm text-gray-600">{trainer.specialization}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(trainer.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{trainer.rating}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {trainer.sessions} sessions
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">₹{trainer.hourlyRate}/hr</span>
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            Your recent sessions with favorite trainers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {favorites.slice(0, 3).map((trainer) => (
              <div key={trainer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={trainer.avatar} />
                    <AvatarFallback>
                      {trainer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{trainer.name}</p>
                    <p className="text-sm text-gray-600">Last session: 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600">Completed</Badge>
                  <Button variant="outline" size="sm">
                    Book Again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesSection;
