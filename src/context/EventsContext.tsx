import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { EventsResponse, SportEvent } from '../types/event';

interface EventsContextValue {
  events: SportEvent[];
  loading: boolean;
  error: string | null;
  getEventById: (id: string) => SportEvent | undefined;
  addEvent: (newEvent: Omit<SportEvent, 'id'>) => void;
  updateEvent: (event: SportEvent) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

const createEventId = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/events.json');
        if (!response.ok) throw new Error('Failed to load events');
        const json = (await response.json()) as EventsResponse;
        const eventsWithId = json.data.map((event, idx) => ({
          ...event,
          id: `${idx}-${event.dateVenue}-${event.timeVenueUTC}`,
        }));
        setEvents(eventsWithId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const addEvent = (newEvent: Omit<SportEvent, 'id'>) => {
    const eventWithId = { ...newEvent, id: createEventId() };
    setEvents(prev => [...prev, eventWithId]);
  };

  const updateEvent = (updatedEvent: SportEvent) => {
    setEvents(prev => prev.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const getEventById = useCallback(
    (id: string) => events.find(event => event.id === id),
    [events],
  );

  return (
    <EventsContext.Provider value={{ events, loading, error, getEventById, addEvent, updateEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEventsContext must be used inside EventsProvider');
  }
  return context;
};
