// src/pages/Events.tsx
import React, { useState, useEffect } from 'react';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/events.css';

interface EventItem {
  title: string;
  date: string;     // yyyy-MM-dd
  time: string;     // full when string
  location: string; // comma-joined address
  speaker: string;  // venue name
}

const MONTH_MAP: Record<string,string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04',
  May: '05', Jun: '06', Jul: '07', Aug: '08',
  Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

const Events = () => {
  const [year, setYear]                 = useState(new Date().getFullYear());
  const [events, setEvents]             = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [formData, setFormData]         = useState({
    title: '', date: '', time: '', location: '', speaker: '',
  });

  useEffect(() => {
    const q   = 'Austin startup events';
    const loc = 'Austin,Texas,United States';
    fetch(
      `/api/events?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`
    )
      .then(res => res.json())
      .then((data: any[]) => {
        const mapped = data.map(ev => {
          const [mon, day] = ev.date.start_date.split(' ');
          const mm = MONTH_MAP[mon] || '01';
          const dd = day.padStart(2, '0');
          return {
            title: ev.title,
            date: `${year}-${mm}-${dd}`,
            time: ev.date.when,
            location: (ev.address || []).join(', '),
            speaker: ev.venue?.name || '',
          };
        });
        setEvents(mapped);
      })
      .catch(err => {
        console.error(err);
        setEvents([]);
      });
  }, [year]);

  const handleDayClick = (fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const filteredEvents = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : [];

  return (
    <div className="page">
      <div className="calendar-title">
        <h2 style={{ color: '#1f1b2e' }}>Events Calendar</h2>
        <p className="login-subtext">
          Your builder timeline from coffee chats to Series A
        </p>
      </div>

      <div className="toolbar-controls">
        <div className="left">
          <button
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                date: selectedDate || `${year}-01-01`
              }));
              setShowModal(true);
            }}
          >
            + Add Event
          </button>
        </div>
        <div className="right year-nav">
          <button onClick={() => setYear(y => y - 1)}>←</button>
          <span style={{ color: '#1f1b2e' }}>{year}</span>
          <button onClick={() => setYear(y => y + 1)}>→</button>
        </div>
      </div>

      <div className="event-layout">
        <div className="calendar-side">
          <div className="calendar-year-grid">
            {Array.from({ length: 12 }, (_, i) => {
              const monthName = new Date(year, i, 1).toLocaleString('default', {
                month: 'long'
              });
              const daysInMonth   = new Date(year, i + 1, 0).getDate();
              const firstDayIndex = new Date(year, i, 1).getDay();

              const cells = Array(firstDayIndex).fill(null).concat(
                Array.from({ length: daysInMonth }, (_, d) => {
                  const dayNum = d + 1;
                  const mm = String(i + 1).padStart(2, '0');
                  const dd = String(dayNum).padStart(2, '0');
                  const fullDate = `${year}-${mm}-${dd}`;
                  const hasEvent = events.some(e => e.date === fullDate);
                  const isSelected = selectedDate === fullDate;

                  return (
                    <div
                      key={dayNum}
                      className={`calendar-cell${hasEvent ? ' has-event' : ''}${
                        isSelected ? ' selected-date' : ''
                      }`}
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
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="calendar-day-name">
                        {d}
                      </div>
                    ))}
                    {cells.map((c, idx) =>
                      c ?? <div key={idx} className="calendar-cell" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="event-layout2">
          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            filteredEvents.map((ev, idx) => (
              <div key={idx} className="event-card">
                <h4>{ev.title}</h4>
                <p>
                  <strong>Time:</strong> {ev.time}
                </p>
                <p>
                  <strong>Location:</strong> {ev.location}
                </p>
                <p>
                  <strong>Speaker:</strong> {ev.speaker}
                </p>
                <p>
                  <strong>Date:</strong> {ev.date}
                </p>

                <button
                  className="email-btn"
                  onClick={async () => {
                    const toEmail = localStorage.getItem('userEmail');
                    if (!toEmail) {
                      return alert('No email on file – please log in.');
                    }
                    const subject = `Event: ${ev.title}`;
                    const body = `
${ev.title}
Time: ${ev.time}
Location: ${ev.location}
Speaker: ${ev.speaker}
Date: ${ev.date}
                    `.trim();

                    try {
                      const resp = await fetch('/api/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ toEmail, subject, body }),
                      });
                      const json = await resp.json();
                      if (json.ok) alert('✅ Email sent to ' + toEmail);
                      else alert('❌ ' + json.error);
                    } catch (e) {
                      console.error(e);
                      alert('Network error sending email');
                    }
                  }}
                >
                  📧 Email Me
                </button>

                <button className="delete-btn" onClick={() => {
                  /* existing delete logic */
                }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* existing + Add Event modal … */}
    </div>
  );
};

export default Events;
