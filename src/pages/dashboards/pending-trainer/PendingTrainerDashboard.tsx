
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const PendingTrainerDashboard = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Trainer Application Status</h1>
            <p className="mt-2 text-lg text-gray-600">Welcome to VyayamZone</p>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl text-yellow-700">Application Under Review</CardTitle>
              <CardDescription className="text-lg">
                Your profile is currently being reviewed by our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We'll notify you once your application has been approved. This process typically takes 1-3 business days.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-left text-blue-700 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Document verification
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Background check
                  </li>
                  <li className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                    Final approval (in progress)
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you have any questions about your application status, please contact our support team.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline">
                  Contact Support
                </Button>
                <Button variant="outline">
                  View FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PendingTrainerDashboard;
