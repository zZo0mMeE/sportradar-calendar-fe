import { useState, useEffect } from 'react';
import type { SportEvent, EventsResponse } from '../types/event';

export const useEvents = () => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/events.json');
      if (!response.ok) throw new Error('Failed to load events');
      const json: EventsResponse = await response.json();
      const eventsWithId = json.data.map((event, idx) => ({
        ...event,
        id: `${idx}-${event.dateVenue}-${event.timeVenueUTC}`
      }));
      setEvents(eventsWithId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => (event as any).id === id);
  };

  const addEvent = (newEvent: Omit<SportEvent, 'id'>) => {
    const eventWithId = {
      ...newEvent,
      id: crypto.randomUUID(),
    };
    setEvents(prev => [...prev, eventWithId]);
  };

  return { events, loading, error, getEventById, addEvent };
};