'use server';

/**
 * @fileOverview A utility to get flight details from OpenSky Network API.
 *
 * - getFlightsByAirport - A function that fetches flights for a given airport.
 * - AirportFlightsInput - The input type for the getFlightsByAirport function.
 * - FlightState - The data type for a single flight's state.
 */

import { z } from 'zod';

const AirportFlightsInputSchema = z.object({
  airport: z.string().describe('The ICAO code of the airport (e.g., VEGY for Hyderabad).'),
});
export type AirportFlightsInput = z.infer<typeof AirportFlightsInputSchema>;

export type FlightState = {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  on_ground: boolean;
};

const API_BASE_URL = 'https://opensky-network.org/api';

// Note: OpenSky API requires airport ICAO codes. Rajiv Gandhi International Airport (HYD) is VEGY.
// We will need a mapping for major airports if we expand. For now, we'll focus on VEGY.
const getFlights = async (airportIcao: string): Promise<FlightState[]> => {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;

    try {
        const [arrivalsResponse, departuresResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/flights/arrival?airport=${airportIcao}&begin=${oneHourAgo}&end=${now}`),
            fetch(`${API_BASE_URL}/flights/departure?airport=${airportIcao}&begin=${oneHourAgo}&end=${now}`)
        ]);

        if (!arrivalsResponse.ok || !departuresResponse.ok) {
            console.error('Arrivals Status:', arrivalsResponse.status, 'Departures Status:', departuresResponse.status);
            throw new Error('Failed to fetch flight data from OpenSky Network.');
        }

        const arrivalsData = await arrivalsResponse.json();
        const departuresData = await departuresResponse.json();
        
        const allFlightsApiData = [...(arrivalsData || []), ...(departuresData || [])];

        const allFlights: FlightState[] = allFlightsApiData.map((flight: any) => ({
            icao24: flight.icao24,
            callsign: flight.callsign,
            origin_country: "N/A", // This detail is not in arrival/departure endpoints
            on_ground: false, // Assumption, not provided directly in this endpoint
        }));

        // Deduplicate flights based on icao24
        const uniqueFlights = Array.from(new Map(allFlights.map(flight => [flight.icao24, flight])).values());

        console.log(`Found ${uniqueFlights.length} unique flights for ${airportIcao}`);
        return uniqueFlights;

    } catch (error) {
        console.error(`Error fetching flights from OpenSky for airport ${airportIcao}:`, error);
        throw new Error('Could not fetch flight data from OpenSky Network.');
    }
}


export async function getFlightsByAirport({ airport }: AirportFlightsInput): Promise<FlightState[]> {
    if (airport.toUpperCase() === 'HYD') {
        // VEGY is the ICAO code for Hyderabad's airport
        return getFlights('VEGY');
    }
    // In the future, we could add a lookup for other IATA codes to ICAO codes
    throw new Error(`Airport ${airport} is not supported yet.`);
}
