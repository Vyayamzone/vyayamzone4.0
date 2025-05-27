
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, Calendar, Settings } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'session' | 'admin' | 'trainer' | 'system';
  timestamp: string;
  read: boolean;
}

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Session Reminder',
      message: 'Your session with Sarah Johnson is scheduled for tomorrow at 10:00 AM',
      type: 'session',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Trainer Response',
      message: 'Mike Rodriguez has accepted your connection request!',
      type: 'trainer',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '3',
      title: 'Goal Achievement',
      message: 'Congratulations! You\'ve completed 10 sessions this month',
      type: 'system',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    trainerUpdates: true,
    goalMilestones: true
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'trainer':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'admin':
        return <Settings className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Stay updated with session reminders, trainer updates, and admin messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No notifications yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Customize how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => 
                setSettings({...settings, emailNotifications: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-gray-600">Get instant notifications on your device</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => 
                setSettings({...settings, pushNotifications: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Reminders</Label>
              <p className="text-sm text-gray-600">Reminders for upcoming sessions</p>
            </div>
            <Switch
              checked={settings.sessionReminders}
              onCheckedChange={(checked) => 
                setSettings({...settings, sessionReminders: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trainer Updates</Label>
              <p className="text-sm text-gray-600">Updates from your trainers</p>
            </div>
            <Switch
              checked={settings.trainerUpdates}
              onCheckedChange={(checked) => 
                setSettings({...settings, trainerUpdates: checked})
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Goal Milestones</Label>
              <p className="text-sm text-gray-600">Celebrate your achievements</p>
            </div>
            <Switch
              checked={settings.goalMilestones}
              onCheckedChange={(checked) => 
                setSettings({...settings, goalMilestones: checked})
              }
            />
          </div>

          <Button className="w-full md:w-auto">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSection;
