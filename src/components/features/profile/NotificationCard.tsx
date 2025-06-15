
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { NotificationSettings } from '../NotificationSettings';

export function NotificationCard() {
  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-terex-accent" />
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400">
          Gérez vos préférences de notification
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <NotificationSettings />
      </CardContent>
    </Card>
  );
}
