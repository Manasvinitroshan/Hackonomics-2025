// src/pages/Events.tsx
import React, { useState, useEffect } from 'react';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/events.css';

interface EventItem {
  title: string;
  date: string;     // yyyy-MM-dd
  time: string;     // full when string
  location: string; // comma-joined address
  speaker: string;  // we’ll use venue name
}

// helper to turn "Jun" → "06", etc.
const MONTH_MAP: Record<string,string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04',
  May: '05', Jun: '06', Jul: '07', Aug: '08',
  Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

const Events = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // form state (unused for fetched events, but kept for +Add Event)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    speaker: '',
  });

  // Fetch once on mount (and refetch if year changes, so date parsing stays correct)
  useEffect(() => {
    const q = 'Austin startup events';
    const loc = 'Austin,Texas,United States';
    fetch(`/api/events?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const mapped: EventItem[] = data.map(ev => {
          // ev.date.start_date is like "Jun 13"
          const [monAbbrev, dayStr] = ev.date.start_date.split(' ');
          const mm = MONTH_MAP[monAbbrev] || '01';
          const dd = dayStr.padStart(2, '0');
          const fullDate = `${year}-${mm}-${dd}`;

          return {
            title: ev.title,
            date: fullDate,
            time: ev.date.when,
            location: (ev.address || []).join(', '),
            speaker: ev.venue?.name || '',
          };
        });
        setEvents(mapped);
      })
      .catch(err => {
        console.error('Failed to load events', err);
        setEvents([]);
      });
  }, [year]);

  const handleDayClick = (fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const saveEvent = () => {
    if (!formData.title || !formData.date) return;
    setEvents([...events, { ...formData }]);
    setShowModal(false);
    setFormData({ title: '', date: '', time: '', location: '', speaker: '' });
  };

  const deleteEvent = (event: EventItem) => {
    setEvents(events.filter(e => e !== event));
  };

  const filteredEvents = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : [];

  return (
    <div className="page">
      <div className="calendar-title">
        <h2 style={{color: '#1f1b2e'}}>Events Calendar</h2>
        <p className="login-subtext">Your builder timeline from coffee chats to Series A</p>
      </div>

      <div className="toolbar-controls">
        <div className="left">
          <button onClick={() => {
            setFormData(prev => ({ ...prev, date: selectedDate || `${year}-01-01` }));
            setShowModal(true);
          }}>+ Add Event</button>
        </div>
        <div className="right year-nav">
          <button onClick={() => setYear(y => y - 1)}>←</button>
          <span style={{color: '#1f1b2e'}}>{year}</span>
          <button onClick={() => setYear(y => y + 1)}>→</button>
        </div>
      </div>

      <div className="event-layout">
        <div className="calendar-side">
          <div className="calendar-year-grid">
            {Array.from({ length: 12 }, (_, i) => {
              const monthName = new Date(year, i, 1)
                .toLocaleString('default', { month: 'long' });
              const daysInMonth = new Date(year, i+1, 0).getDate();
              const firstDayIndex = new Date(year, i, 1).getDay();

              // build blank cells + days
              const cells = Array(firstDayIndex).fill(null).concat(
                Array.from({ length: daysInMonth }, (_, d) => {
                  const dayNum = d + 1;
                  const mm = String(i+1).padStart(2,'0');
                  const dd = String(dayNum).padStart(2,'0');
                  const fullDate = `${year}-${mm}-${dd}`;
                  const hasEvent = events.some(e => e.date === fullDate);
                  const isSelected = selectedDate === fullDate;

                  return (
                    <div
                      key={dayNum}
                      className={`calendar-cell ${hasEvent? 'has-event':''} ${isSelected? 'selected-date':''}`}
                      onClick={() => handleDayClick(fullDate)}
                    >
                      {dayNum}
                    </div>
                  );
                })
              );

              return (
                <div key={i} className="month-container">
                  <h3>{monthName}</h3>
                  <div className="calendar-grid">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
                      .map(d => <div key={d} className="calendar-day-name">{d}</div>)}
                    {cells.map((c, idx) => c ?? <div key={idx} className="calendar-cell" />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="event-layout2">
          {selectedDate && <h3>Events on {selectedDate}</h3>}
          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            filteredEvents.map((ev, idx) => (
              <div key={idx} className="event-card">
                <h4>{ev.title}</h4>
                <p><strong>Time:</strong> {ev.time}</p>
                <p><strong>Location:</strong> {ev.location}</p>
                <p><strong>Speaker:</strong> {ev.speaker}</p>
                <p><strong>Date:</strong> {ev.date}</p>
                <button className="delete-btn" onClick={() => deleteEvent(ev)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Event — {formData.date}</h3>
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              type="time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Speaker"
              value={formData.speaker}
              onChange={e => setFormData({ ...formData, speaker: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button onClick={saveEvent}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
