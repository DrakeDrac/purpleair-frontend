import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, Thermometer, Droplets, Gauge as GaugeIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import sensorIllustration from '@/assets/sensor-illustration.jpg';

export default function Sensors() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [filteredSensors, setFilteredSensors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationType, setLocationType] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSensors();
  }, [locationType]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSensors(sensors);
    } else {
      const filtered = sensors.filter((sensor) => 
        sensor[1]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSensors(filtered);
    }
  }, [searchQuery, sensors]);

  const fetchSensors = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getSensors(undefined, locationType) as any;
      setSensors(response.data || []);
      setFilteredSensors(response.data || []);
    } catch (error) {
      toast({
        title: 'Error loading sensors',
        description: error instanceof Error ? error.message : 'Failed to fetch sensors',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAirQualityLabel = (pm25: number) => {
    if (pm25 <= 12) return { label: 'Good', color: 'bg-green-500' };
    if (pm25 <= 35) return { label: 'Moderate', color: 'bg-yellow-500' };
    if (pm25 <= 55) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500' };
    if (pm25 <= 150) return { label: 'Unhealthy', color: 'bg-red-500' };
    return { label: 'Very Unhealthy', color: 'bg-purple-500' };
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Weather Sensors</h1>
            <p className="text-muted-foreground">Monitor air quality and weather data</p>
          </div>
          <Button onClick={fetchSensors} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass-card border-white/20">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sensors by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={locationType === undefined ? 'default' : 'outline'}
                  onClick={() => setLocationType(undefined)}
                  className={locationType === undefined ? 'bg-secondary text-white' : 'glass-input'}
                >
                  All
                </Button>
                <Button
                  variant={locationType === 0 ? 'default' : 'outline'}
                  onClick={() => setLocationType(0)}
                  className={locationType === 0 ? 'bg-secondary text-white' : 'glass-input'}
                >
                  Outside
                </Button>
                <Button
                  variant={locationType === 1 ? 'default' : 'outline'}
                  onClick={() => setLocationType(1)}
                  className={locationType === 1 ? 'bg-secondary text-white' : 'glass-input'}
                >
                  Inside
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensors Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : filteredSensors.length === 0 ? (
          <Card className="glass-card border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <img src={sensorIllustration} alt="No sensors" className="w-48 h-48 mb-4 opacity-50" />
              <p className="text-muted-foreground">No sensors found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSensors.map((sensor) => {
              const [sensor_index, name, latitude, longitude, pm25, , , , , , , temperature, humidity] = sensor;
              const airQuality = getAirQualityLabel(pm25 || 0);
              
              return (
                <Link key={sensor_index} to={`/sensors/${sensor_index}`}>
                  <Card className="glass-card border-white/20 hover:shadow-xl transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1">{name || 'Unnamed Sensor'}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                          </CardDescription>
                        </div>
                        <Badge className={`${airQuality.color} text-white border-0`}>
                          {airQuality.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GaugeIcon className="h-4 w-4 text-secondary" />
                          <span className="text-sm text-muted-foreground">PM2.5</span>
                        </div>
                        <span className="font-semibold">{pm25?.toFixed(1) || 'N/A'} µg/m³</span>
                      </div>
                      {temperature && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-accent" />
                            <span className="text-sm text-muted-foreground">Temperature</span>
                          </div>
                          <span className="font-semibold">{temperature?.toFixed(1)}°F</span>
                        </div>
                      )}
                      {humidity && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">Humidity</span>
                          </div>
                          <span className="font-semibold">{humidity?.toFixed(0)}%</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
