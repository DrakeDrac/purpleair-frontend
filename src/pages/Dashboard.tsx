import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Cloud, Sun, Wind, Droplets, Gauge, Sparkles } from 'lucide-react';
import weatherHero from '@/assets/weather-hero.jpg';

export default function Dashboard() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sensors = await apiClient.getSensors('sensor_index,name,pm2.5,temperature,humidity,pressure', 0);
        const sensorData = (sensors as any).data?.[0];
        
        if (sensorData) {
          const [sensorIndex, name, pm25, temp, humidity, pressure] = sensorData;
          setWeatherData({
            temperature: temp || 72,
            humidity: humidity || 45,
            pressure: pressure || 1013,
            pm25: pm25 || 12,
            condition: pm25 < 12 ? 'Good' : pm25 < 35 ? 'Moderate' : pm25 < 55 ? 'Unhealthy for Sensitive' : 'Unhealthy',
          });
        } else {
          setWeatherData({
            temperature: 72,
            humidity: 45,
            pressure: 1013,
            pm25: 12,
            condition: 'Good',
          });
        }
      } catch (error) {
        setWeatherData({
          temperature: 72,
          humidity: 45,
          pressure: 1013,
          pm25: 12,
          condition: 'Good',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getAirQualityColor = (pm25: number) => {
    if (pm25 < 12) return 'bg-green-500';
    if (pm25 < 35) return 'bg-yellow-500';
    if (pm25 < 55) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getAirQualityWidth = (pm25: number) => {
    return Math.min((pm25 / 100) * 100, 100);
  };

  const getBuddyAdvice = (condition: string) => {
    const advices: { [key: string]: string } = {
      'Good': "Yay! The air is super clean today! Perfect for playing outside! 🌟",
      'Moderate': "The air is okay today. You can play outside, but take breaks if you feel tired! 😊",
      'Unhealthy for Sensitive': "The air isn't the best today. If you have asthma or allergies, try to play indoors! 🏠",
      'Unhealthy': "The air quality isn't good today. Let's play inside games and stay safe! 🎮",
    };
    return advices[condition] || advices['Good'];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Cloud className="h-16 w-16 text-secondary animate-float" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Weather Section */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <img 
            src={weatherHero} 
            alt="Weather illustration" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sun className="h-12 w-12 text-secondary animate-bounce-slow" />
              <div>
                <h1 className="text-5xl font-bold">
                  {weatherData?.temperature}°F
                </h1>
                <p className="text-xl text-muted-foreground">
                  {weatherData?.condition} Air Quality
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Air Quality Bar */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-secondary" />
              Air Quality Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Clean</span>
                <span>Not Clean</span>
              </div>
              <div className="relative h-8 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getAirQualityColor(weatherData?.pm25)} transition-all duration-500 rounded-full`}
                  style={{ width: `${getAirQualityWidth(weatherData?.pm25)}%` }}
                />
              </div>
              <p className="text-center text-lg font-semibold">
                PM2.5: {weatherData?.pm25} - {weatherData?.condition}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buddy Advice Section */}
        <Card className="glass-card border-white/20 bg-gradient-to-br from-secondary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
              Buddy's Advice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-start">
              <div className="text-6xl animate-bounce-slow">🤖</div>
              <div className="flex-1">
                <p className="text-lg leading-relaxed">
                  {getBuddyAdvice(weatherData?.condition)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Details Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-card border-white/20 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Sun className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weatherData?.temperature}°F</div>
              <p className="text-xs text-muted-foreground mt-1">
                Feels comfortable
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplets className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weatherData?.humidity}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Moisture in air
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/20 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wind</CardTitle>
              <Wind className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5 mph</div>
              <p className="text-xs text-muted-foreground mt-1">
                Gentle breeze
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
