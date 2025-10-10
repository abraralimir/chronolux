'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlaneTakeoff } from 'lucide-react';
import { getFlightsByAirport, type FlightState } from '@/ai/flows/get-opensky-flights';
import { useToast } from '@/hooks/use-toast';

const FlightProgress = () => {
  const [flights, setFlights] = useState<FlightState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      // For now, we are hardcoding to Hyderabad (HYD -> VEGY)
      const flightData = await getFlightsByAirport({ airport: 'HYD' });
      setFlights(flightData);
    } catch (error) {
      console.error("Failed to fetch flights from OpenSky:", error);
      toast({
        variant: "destructive",
        title: "Could Not Fetch Flights",
        description: "There was a problem fetching live flight data. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    // Refresh data every 2 minutes
    const interval = setInterval(fetchFlights, 120000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlaneTakeoff className="h-6 w-6" />
          Live Flights for Hyderabad (HYD)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : flights.length > 0 ? (
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Callsign</TableHead>
                  <TableHead>Origin Country</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flights.map((flight) => (
                  <TableRow key={flight.icao24}>
                    <TableCell className="font-medium">{flight.callsign || 'N/A'}</TableCell>
                    <TableCell>{flight.origin_country}</TableCell>
                    <TableCell>{flight.on_ground ? 'On Ground' : 'In Air'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No active flights found for Hyderabad at this moment.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={fetchFlights} disabled={isLoading} variant="ghost" size="sm">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlightProgress;
