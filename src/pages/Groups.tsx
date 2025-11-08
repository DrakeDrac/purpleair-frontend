import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Users, Loader2 } from 'lucide-react';
import sensorIllustration from '@/assets/sensor-illustration.jpg';

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getGroups() as any;
      setGroups(response.data || []);
    } catch (error) {
      toast({
        title: 'Error loading groups',
        description: error instanceof Error ? error.message : 'Failed to fetch groups',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sensor Groups</h1>
            <p className="text-muted-foreground">Organize your sensors into groups</p>
          </div>
          <Button onClick={fetchGroups} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </div>

        {/* Groups Display */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : groups.length === 0 ? (
          <Card className="glass-card border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <img src={sensorIllustration} alt="No groups" className="w-48 h-48 mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg font-medium mb-2">No groups yet</p>
              <p className="text-sm text-muted-foreground">Create groups to organize your sensors</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const [group_id, name, description, sensor_count] = group;
              return (
                <Card key={group_id} className="glass-card border-white/20 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{name || 'Unnamed Group'}</CardTitle>
                        <CardDescription>{sensor_count || 0} sensors</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
