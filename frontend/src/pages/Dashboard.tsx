import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaFileAlt,
  FaBook,
  FaCalendarAlt,
  FaComments,
  FaTachometerAlt,
  FaRocket,
  FaFileUpload
} from 'react-icons/fa';
import '../styles/dashboard.css';

interface Stats { runway: number; burnRate: number; revenue: number; }
interface Post { postId: string; author: string; content: string; timestamp: string; }
interface EventItem { title: string; date: string; time: string; location: string; speaker: string; }
interface UploadedDoc { key: string; url: string; lastModified: string; }
interface NewsItem { title: string; url: string; source: string; }
interface SimulationPoint { month: string; revenue: number; expenses: number; }

const MONTH_MAP: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

export default function Dashboard() {
  // pull first name from Cognito JWT stored in localStorage
  const [firstName, setFirstName] = useState<string>('');
  const [keyStats, setKeyStats] = useState<Stats>({ runway: 0, burnRate: 0, revenue: 0 });
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [lastDoc, setLastDoc] = useState<UploadedDoc | null>(null);
  const [lastChartUrl, setLastChartUrl] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [lastSimulation, setLastSimulation] = useState<SimulationPoint[]>([]);

  useEffect(() => {
    // decode idToken to get given_name
    const token = localStorage.getItem('idToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setFirstName(payload.given_name || payload.name || '');
      } catch (err) {
        console.error('Failed to decode idToken', err);
      }
    }

    axios.get('/api/stats')
      .then(res => {
        setKeyStats(res.data.stats);
        setLastSimulation(res.data.simulationHistory);
      })
      .catch(console.error);

    axios.get<Post[]>('/api/posts?limit=3')
      .then(res => setLatestPosts(res.data))
      .catch(console.error);

    fetch(
      `/api/events?q=${encodeURIComponent('Austin startup events')}` +
      `&location=${encodeURIComponent('Austin,Texas,United States')}`
    )
      .then(r => r.json())
      .then((data: any[]) => {
        setEvents(
          data.map(ev => {
            const [mon, day] = ev.date.start_date.split(' ');
            const mm = MONTH_MAP[mon] || '01';
            const dd = day.padStart(2, '0');
            return {
              title: ev.title,
              date: `${new Date().getFullYear()}-${mm}-${dd}`,
              time: ev.date.when,
              location: (ev.address || []).join(', '),
              speaker: ev.venue?.name || '',
            };
          })
        );
      })
      .catch(console.error);

    axios.get<UploadedDoc>('/upload/list')
      .then(res => setLastDoc(res.data))
      .catch(() => setLastDoc(null));

    axios.get<{ url: string }>('/api/simulations')
      .then(res => setLastChartUrl(res.data.url))
      .catch(() => setLastChartUrl(null));

    axios.get<NewsItem[]>('/api/news/finance?limit=4')
      .then(res => setNews(res.data))
      .catch(() => setNews([]));
  }, []);

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#6b7280',
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {firstName} 👋</h1>
        <p>Here’s your startup at a glance—key stats, posts, events &amp; news.</p>
      </div>

      <div className="stats-grid">
        {/* Last Uploaded Document */}
        <div className="card">
          <p style={labelStyle}>
            <FaFileAlt size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            Last Uploaded Document
          </p>
          {lastDoc ? (
            <a
              href={lastDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                color: '#4f46e5',
                fontWeight: 500,
                textDecoration: 'none',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: '#f5f5ff',
                transition: 'background-color 0.2s',
              }}
            >
              {lastDoc.key.replace(/^\d+-/, '')}
            </a>
          ) : (
            <p className="empty">No uploads found.</p>
          )}
        </div>

        {/* Latest Financial News */}
        <div className="card">
          <p style={labelStyle}>
            <FaBook size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            Latest Financial News
          </p>
          {news.length > 0 ? (
            news.map((n, i) => (
              <div
                key={i}
                style={{
                  marginBottom: i < news.length - 1 ? '8px' : '0',
                  padding: '12px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5ff',
                }}
              >
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: '#4f46e5',
                    fontWeight: 500,
                    display: 'block',
                  }}
                >
                  {n.title}
                </a>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{n.source}</span>
              </div>
            ))
          ) : (
            <p className="empty">No news available.</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <p style={labelStyle}>
            <FaCalendarAlt size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            Upcoming Events
          </p>
          {events.length > 0 ? (
            events.slice(0, 3).map((ev, i) => (
              <div
                key={i}
                style={{
                  marginBottom: i < 2 ? '12px' : '0',
                  padding: '12px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5ff',
                }}
              >
                <div style={{ fontWeight: 500, color: '#4f46e5' }}>{ev.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{ev.date} @ {ev.time}</div>
                <div style={{ fontSize: '0.8rem', color: '#374151' }}>{ev.speaker}{ev.speaker && ev.location ? ', ' : ''}{ev.location}</div>
              </div>
            ))
          ) : (
            <p className="empty">No upcoming events.</p>
          )}
        </div>

        {/* Latest Forum Posts */}
        <div className="card">
          <p style={labelStyle}>
            <FaComments size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            Latest Forum Posts
          </p>
          {latestPosts.length > 0 ? (
            latestPosts.map((p, i) => (
              <div
                key={p.postId}
                style={{
                  marginBottom: i < latestPosts.length - 1 ? '12px' : '0',
                  padding: '12px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5ff',
                }}
              >
                <div style={{ fontWeight: 500, color: '#4f46e5' }}>
                  {p.author} <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>({new Date(p.timestamp).toLocaleDateString()})</span>
                </div>
                <div style={{ marginTop: 8, color: '#374151' }}>{p.content}</div>
              </div>
            ))
          ) : (
            <p className="empty">No posts yet.</p>
          )}
        </div>

        {/* Last Simulation Chart */}
        <div className="card simulation-card">
          <p style={labelStyle}>
            <FaTachometerAlt size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            Last Simulation
          </p>
          {lastChartUrl ? (
            <div style={{
              padding: '12px',
              borderRadius: '4px',
              backgroundColor: '#f5f5ff',
              display: 'flex',
              justifyContent: 'center',
            }}> 
              <img
                src={lastChartUrl}
                alt="Last Simulation Chart"
                style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <p className="empty">No simulation run yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card actions-card">
          <p style={labelStyle}>
            <FaRocket size={18} color="#4f46e5" style={{ marginRight: 8 }} />
            Quick Actions
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}> 
            {[
              { label: 'Ask CFO', to: '/ai-cfo' },
              { label: 'Upload PDF', to: '/ai-cfo?tab=upload' },
              { label: 'Run Simulation', to: '/simulation' },
              { label: 'Explore Events', to: '/events' },
            ].map(({ label, to }, idx) => (
              <Link
                key={idx}
                to={to}
                style={{
                  flex: '1 1 calc(50% - 12px)',
                  backgroundColor: '#f5f5ff',
                  padding: '10px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background-color 0.2s',
                }}
              >
                <span style={{ color: '#4f46e5', fontWeight: 500 }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
