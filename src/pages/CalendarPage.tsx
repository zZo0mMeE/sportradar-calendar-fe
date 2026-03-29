import { useEffect, useMemo, useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';
import CalendarHeader from '../components/CalendarHeader';
import CalendarGrid from '../components/CalendarGrid';
import { useNavigate } from 'react-router-dom';
import type { SportEvent } from '../types/event';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    events: SportEvent[];
}

const CalendarPage = () => {
    const { events, loading } = useEvents();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();

    const formatMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const parseDate = (dateStr: string) => new Date(`${dateStr}T00:00:00`);

    const eventMonths = useMemo(() => {
        const monthSet = new Set<string>();
        const sortedDates = [...events].map(event => event.dateVenue).sort();
        return sortedDates.reduce<string[]>((list, dateVenue) => {
            const monthKey = dateVenue.slice(0, 7);
            if (!monthSet.has(monthKey)) {
                monthSet.add(monthKey);
                list.push(monthKey);
            }
            return list;
        }, []);
    }, [events]);

    useEffect(() => {
        if (initialized || loading) return;
        if (events.length === 0) {
            setInitialized(true);
            return;
        }

        const today = new Date();
        const todayMonthKey = formatMonthKey(today);
        const hasTodayEvents = eventMonths.includes(todayMonthKey);
        const initialDate = hasTodayEvents ? today : parseDate(eventMonths[0]);
        setCurrentDate(initialDate);
        setInitialized(true);
    }, [eventMonths, events.length, initialized, loading]);

    const getEventsForDate = (date: Date): SportEvent[] => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        return events.filter(event => event.dateVenue === dateStr);
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const calendarDays: CalendarDay[] = [];

    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        calendarDays.push({
            date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
            isCurrentMonth: false,
            events: []
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        calendarDays.push({
            date,
            isCurrentMonth: true,
            events: getEventsForDate(date)
        });
    }

    const remainingCells = 42 - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
        const nextMonth = new Date(year, month + 1, day);
        calendarDays.push({
            date: nextMonth,
            isCurrentMonth: false,
            events: []
        });
    }

    const handleEventClick = (event: SportEvent) => {
        navigate(`/event/${(event as any).id}`);
    };

    if (loading) {
        return <div className="loading-message">Loading events...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <CalendarHeader
                    currentDate={currentDate}
                    onPreviousMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                    onToday={goToToday}
                />
                {eventMonths.length > 0 && (
                    <div className="month-jump-bar">
                        <label htmlFor="event-month" className="month-jump-label">Jump to month with events:</label>
                        <select
                            id="event-month"
                            className="month-jump-select"
                            value={eventMonths.includes(formatMonthKey(currentDate)) ? formatMonthKey(currentDate) : ''}
                            onChange={e => {
                                const [year, month] = e.target.value.split('-').map(Number);
                                setCurrentDate(new Date(year, month - 1, 1));
                            }}
                        >
                            {!eventMonths.includes(formatMonthKey(currentDate)) && (
                                <option value="" disabled>
                                    Select event month
                                </option>
                            )}
                            {eventMonths.map(monthKey => {
                                const [year, month] = monthKey.split('-').map(Number);
                                const label = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                return (
                                    <option key={monthKey} value={monthKey}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}
                <CalendarGrid days={calendarDays} onEventClick={handleEventClick} />
            </div>
        </div>
    );
};

export default CalendarPage;