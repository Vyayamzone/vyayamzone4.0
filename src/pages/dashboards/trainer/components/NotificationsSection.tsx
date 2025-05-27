
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, Calendar, Award } from 'lucide-react';

const NotificationsSection = () => {
  // Mock notifications - in a real app, these would come from the database
  const notifications = [
    {
      id: 1,
      type: 'session',
      title: 'Session Reminder',
      message: 'You have a session with John Doe tomorrow at 10:00 AM',
      time: '2 hours ago',
      icon: Calendar,
      unread: true
    },
    {
      id: 2,
      type: 'feedback',
      title: 'New Feedback Received',
      message: 'Sarah Johnson left a 5-star review for your yoga session',
      time: '1 day ago',
      icon: Award,
      unread: true
    },
    {
      id: 3,
      type: 'admin',
      title: 'Profile Update',
      message: 'Your certification documents have been verified',
      time: '3 days ago',
      icon: MessageSquare,
      unread: false
    },
    {
      id: 4,
      type: 'session',
      title: 'Session Completed',
      message: 'Mark your session with Mike Wilson as completed',
      time: '1 week ago',
      icon: Calendar,
      unread: false
    }
  ];

  const getNotificationColor = (type: string, unread: boolean) => {
    const baseColor = unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200';
    return baseColor;
  };

  const markAllAsRead = () => {
    // In a real app, this would update the database
    console.log('Marking all notifications as read');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>Stay updated with your training activities</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet.</p>
              <p className="text-sm">We'll notify you about important updates here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${getNotificationColor(
                      notification.type,
                      notification.unread
                    )}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.unread ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-4 h-4 ${
                          notification.unread ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            notification.unread ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                            {notification.unread && (
                              <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                            )}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Session Reminders</h4>
                <p className="text-sm text-gray-600">Get reminded about upcoming sessions</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Feedback Alerts</h4>
                <p className="text-sm text-gray-600">Be notified when clients leave feedback</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSection;
