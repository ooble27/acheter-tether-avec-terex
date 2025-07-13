
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface BlogAuthorCardProps {
  name: string;
  bio?: string | null;
  avatar?: string | null;
}

export const BlogAuthorCard = ({ name, bio, avatar }: BlogAuthorCardProps) => {
  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              <Badge variant="secondary">Auteur</Badge>
            </div>
            {bio && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
