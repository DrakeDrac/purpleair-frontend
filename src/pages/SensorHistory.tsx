import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function SensorHistory() {
  const { sensorIndex } = useParams();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [historyData, setHistoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Please select dates',
        description: 'Select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const start_timestamp = Math.floor(startDate.getTime() / 1000);
      const end_timestamp = Math.floor(endDate.getTime() / 1000);
      
      const response = await apiClient.getSensorHistory(
        parseInt(sensorIndex!),
        start_timestamp,
        end_timestamp
      ) as any;
      setHistoryData(response);
      toast({
        title: 'Data loaded',
        description: `Found ${response.data?.length || 0} records`,
      });
    } catch (error) {
      toast({
        title: 'Error loading history',
        description: error instanceof Error ? error.message : 'Failed to fetch history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Please select dates',
        description: 'Select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    try {
      const start_timestamp = Math.floor(startDate.getTime() / 1000);
      const end_timestamp = Math.floor(endDate.getTime() / 1000);
      
      const csvData = await apiClient.getSensorHistoryCSV(
        parseInt(sensorIndex!),
        start_timestamp,
        end_timestamp
      );
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sensor-${sensorIndex}-history.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download started',
        description: 'CSV file is being downloaded',
      });
    } catch (error) {
      toast({
        title: 'Error downloading CSV',
        description: error instanceof Error ? error.message : 'Failed to download',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/sensors/${sensorIndex}`}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Sensor History</h1>
            <p className="text-muted-foreground">View historical data for sensor #{sensorIndex}</p>
          </div>
        </div>

        {/* Date Selection */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle>Select Date Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal glass-input',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal glass-input',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={fetchHistory}
                disabled={isLoading || !startDate || !endDate}
                className="bg-secondary hover:bg-secondary/90 text-white"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load Data
              </Button>
              <Button
                onClick={downloadCSV}
                variant="outline"
                disabled={!startDate || !endDate}
                className="glass-input gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Display */}
        {historyData && (
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Historical Data ({historyData.data?.length || 0} records)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      {historyData.fields?.map((field: string) => (
                        <th key={field} className="text-left p-2 font-semibold">
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.data?.map((row: any[], index: number) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2">
                            {cellIndex === 0 
                              ? new Date(cell * 1000).toLocaleString()
                              : typeof cell === 'number' 
                                ? cell.toFixed(2) 
                                : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
