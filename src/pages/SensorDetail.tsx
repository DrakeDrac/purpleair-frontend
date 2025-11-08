import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Thermometer, Droplets, Gauge as GaugeIcon, Wind, Loader2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SensorDetail() {
  const { sensorIndex } = useParams();
  const [sensor, setSensor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (sensorIndex) {
      fetchSensorDetail();
    }
  }, [sensorIndex]);

  const fetchSensorDetail = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getSensorByIndex(parseInt(sensorIndex!)) as any;
      setSensor(response.sensor);
    } catch (error) {
      toast({
        title: 'Error loading sensor',
        description: error instanceof Error ? error.message : 'Failed to fetch sensor details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAirQualityLabel = (pm25: number) => {
    if (pm25 <= 12) return { label: 'Good', color: 'bg-green-500', description: 'Air quality is great!' };
    if (pm25 <= 35) return { label: 'Moderate', color: 'bg-yellow-500', description: 'Air quality is acceptable' };
    if (pm25 <= 55) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500', description: 'Sensitive groups may be affected' };
    if (pm25 <= 150) return { label: 'Unhealthy', color: 'bg-red-500', description: 'Everyone may experience health effects' };
    return { label: 'Very Unhealthy', color: 'bg-purple-500', description: 'Health alert' };
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      </Layout>
    );
  }

  if (!sensor) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Sensor not found</p>
          <Link to="/sensors">
            <Button className="mt-4">Back to Sensors</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const airQuality = getAirQualityLabel(sensor.pm2_5 || 0);
  const lastSeen = sensor.last_seen ? new Date(sensor.last_seen * 1000).toLocaleString() : 'Unknown';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/sensors">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{sensor.name || 'Unnamed Sensor'}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" />
              {sensor.latitude?.toFixed(6)}, {sensor.longitude?.toFixed(6)}
            </p>
          </div>
          <Link to={`/sensors/${sensorIndex}/history`}>
            <Button className="bg-secondary hover:bg-secondary/90 text-white gap-2">
              <Calendar className="h-4 w-4" />
              View History
            </Button>
          </Link>
        </div>

        {/* Air Quality Status */}
        <Card className="glass-card border-white/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Badge className={`${airQuality.color} text-white border-0 text-lg px-6 py-2`}>
                {airQuality.label}
              </Badge>
              <div>
                <div className="text-6xl font-bold mb-2">{sensor.pm2_5?.toFixed(1) || 'N/A'}</div>
                <div className="text-muted-foreground">PM2.5 µg/m³</div>
              </div>
              <p className="text-muted-foreground max-w-md">{airQuality.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Readings Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sensor.temperature?.toFixed(1) || 'N/A'}°F</div>
              <p className="text-xs text-muted-foreground mt-1">Current temperature</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplets className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sensor.humidity?.toFixed(0) || 'N/A'}%</div>
              <p className="text-xs text-muted-foreground mt-1">Relative humidity</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pressure</CardTitle>
              <Wind className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sensor.pressure?.toFixed(0) || 'N/A'}</div>
              <p className="text-xs text-muted-foreground mt-1">Millibars</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PM2.5 ATM</CardTitle>
              <GaugeIcon className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sensor.pm2_5_atm?.toFixed(1) || 'N/A'}</div>
              <p className="text-xs text-muted-foreground mt-1">µg/m³</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Sensor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sensor Index</span>
              <span className="font-semibold">{sensor.sensor_index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Seen</span>
              <span className="font-semibold">{lastSeen}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PM2.5 CF-1</span>
              <span className="font-semibold">{sensor.pm2_5_cf_1?.toFixed(1) || 'N/A'} µg/m³</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
