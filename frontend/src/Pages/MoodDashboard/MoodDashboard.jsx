import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { BarChart3, CalendarDays, ChartPie } from 'lucide-react';
import UseStore from '@/store/UseStore';
import MoodHeatmap from './MoodHeatMap';
import WellnessChecklist from './WellnessChecklist';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const API_BASE = 'http://127.0.0.1:8000';

const MOODS = {
  happy: { emoji: '😊', color: '#F59E0B' },
  surprised: { emoji: '😮', color: '#06B6D4' },
  angry: { emoji: '😡', color: '#F97316' },
  sad: { emoji: '😢', color: '#6366F1' },
  calm: { emoji: '😌', color: '#10B981' },
  love: { emoji: '🥰', color: '#F43F5E' },
  anxious: { emoji: '😬', color: '#8B5CF6' },
  proud: { emoji: '😇', color: '#A78BFA' },
};

function groupByDate(entries) {
  const byDate = new Map();
  (entries || []).forEach((e) => {
    const d = new Date(e.date);
    const key = format(d, 'yyyy-MM-dd');
    const list = byDate.get(key) || [];
    list.push(e);
    byDate.set(key, list);
  });
  return byDate;
}

function aggregateDaily(byDate) {
  const result = [];
  [...byDate.entries()].sort(([a], [b]) => (a > b ? 1 : -1)).forEach(([key, list]) => {
    const avgIntensity = Math.round(list.reduce((s, i) => s + (i.intensity || 0), 0) / list.length);
    result.push({ date: key, intensity: avgIntensity });
  });
  return result;
}

function pieDistribution(entries) {
  const counter = new Map();
  (entries || []).forEach((e) => {
    if (e.moodId) counter.set(e.moodId, (counter.get(e.moodId) || 0) + 1);
  });
  return [...counter.entries()].map(([id, value]) => ({ name: id, value, color: MOODS[id]?.color || '#9CA3AF' }));
}

const MoodDashboard = () => {
  const { wellnessData, setWellnessData } = UseStore();
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [rangeDays, setRangeDays] = useState(30);

  const getSessionWithRetry = async () => {
    const { data } = await supabase.auth.getSession();
    const currentSession = data?.session;

    if (currentSession?.access_token && currentSession?.user?.id) {
      return currentSession;
    }

    const { data: refreshed } = await supabase.auth.refreshSession();
    return refreshed?.session || null;
  };

  const getMoodStorageKey = (userId) => `moodEntries:${userId}`;

  const mapApiEntryToStoreEntry = (entry) => ({
    id: entry.id,
    date: entry.created_at,
    moodId: entry.mood_label ? entry.mood_label.toLowerCase() : null,
    moodLabel: entry.mood_label || null,
    emoji: entry.emoji || null,
    intensity: entry.intensity || 0,
    note: entry.note || null,
  });

  // hydrate from backend, then fallback to localStorage
  useEffect(() => {
    const fetchMoodEntries = async () => {
      setLoadingDashboard(true);
      setDashboardError('');
      try {
        const session = await getSessionWithRetry();
        const token = session?.access_token;
        const userId = session?.user?.id;

        if (!token || !userId) {
          setWellnessData([]);
          return;
        }

        const response = await axios.get(`${API_BASE}/mood-entries`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mapped = (response?.data?.entries || []).map(mapApiEntryToStoreEntry);
        setWellnessData(mapped);
        localStorage.setItem(getMoodStorageKey(userId), JSON.stringify(mapped));
      } catch {
        const session = await getSessionWithRetry();
        const userId = session?.user?.id;
        const saved = userId
          ? JSON.parse(localStorage.getItem(getMoodStorageKey(userId)) || '[]')
          : [];

        if (saved?.length) setWellnessData(saved);
        else setDashboardError('Could not load mood analytics right now.');
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchMoodEntries();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchMoodEntries();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [setWellnessData]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - (rangeDays - 1));
    from.setHours(0, 0, 0, 0);
    return (wellnessData || []).filter((entry) => new Date(entry.date) >= from);
  }, [wellnessData, rangeDays]);

  const byDate = useMemo(() => groupByDate(filteredEntries || []), [filteredEntries]);
  const lineData = useMemo(() => aggregateDaily(byDate), [byDate]);
  const pieData = useMemo(() => pieDistribution(filteredEntries || []), [filteredEntries]);

  const avgIntensity = useMemo(() => {
    if (!filteredEntries.length) return 0;
    return Math.round(filteredEntries.reduce((sum, e) => sum + (e.intensity || 0), 0) / filteredEntries.length);
  }, [filteredEntries]);

  const previousRangeEntries = useMemo(() => {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - (rangeDays - 1));
    currentStart.setHours(0, 0, 0, 0);

    const previousStart = new Date(currentStart);
    previousStart.setDate(currentStart.getDate() - rangeDays);

    return (wellnessData || []).filter((entry) => {
      const date = new Date(entry.date);
      return date >= previousStart && date < currentStart;
    });
  }, [wellnessData, rangeDays]);

  const previousAvgIntensity = useMemo(() => {
    if (!previousRangeEntries.length) return 0;
    return Math.round(
      previousRangeEntries.reduce((sum, e) => sum + (e.intensity || 0), 0) / previousRangeEntries.length
    );
  }, [previousRangeEntries]);

  const intensityTrendText = useMemo(() => {
    if (!filteredEntries.length) {
      return 'No entries in the selected range yet.';
    }

    if (!previousRangeEntries.length) {
      return 'No previous-period data available for comparison yet.';
    }

    const delta = avgIntensity - previousAvgIntensity;
    if (delta === 0) {
      return `Your average intensity is stable at ${avgIntensity}/10 compared with the previous ${rangeDays} days.`;
    }

    const direction = delta > 0 ? 'higher' : 'lower';
    return `Your average intensity is ${Math.abs(delta)} point${Math.abs(delta) > 1 ? 's' : ''} ${direction} than the previous ${rangeDays} days (${previousAvgIntensity}/10 → ${avgIntensity}/10).`;
  }, [filteredEntries, previousRangeEntries, avgIntensity, previousAvgIntensity, rangeDays]);

  const mostCommonMood = useMemo(() => {
    if (!pieData.length) return 'N/A';
    const top = [...pieData].sort((a, b) => b.value - a.value)[0];
    return top?.name ? `${top.name} ${MOODS[top.name]?.emoji || ''}`.trim() : 'N/A';
  }, [pieData]);



  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center shadow-md">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-purple-700">Mood Analytics</h1>
              <p className="text-gray-500">Visualize mood trends and history</p>
            </div>
            <div className="ml-auto">
              <select
                value={rangeDays}
                onChange={(e) => setRangeDays(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-purple-200 text-sm text-gray-700"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4">
            <p className="text-sm text-gray-500">Entries in range</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{filteredEntries.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4">
            <p className="text-sm text-gray-500">Average intensity</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{avgIntensity}/10</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4">
            <p className="text-sm text-gray-500">Most common mood</p>
            <p className="text-2xl font-bold text-purple-700 mt-1 capitalize">{mostCommonMood}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4">
          <p className="text-sm text-gray-600">{intensityTrendText}</p>
        </div>

        {dashboardError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {dashboardError}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4 sm:p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Mood Intensity Trend</span>
            </div>
            <div className="h-64">
              {loadingDashboard ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading trend...</div>
              ) : lineData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">No mood entries in selected range.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip />
                    <Line type="monotone" dataKey="intensity" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <ChartPie className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Mood Distribution</span>
            </div>
            <div className="h-64">
              {loadingDashboard ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading distribution...</div>
              ) : pieData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">No mood distribution yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="capitalize">{d.name}</span>
                  <span className="ml-auto font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="relative rounded-3xl border border-purple-200/40 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(147,51,234,0.25)] p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <CalendarDays className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold tracking-wide">This Month</span>
          </div>

          {/* Calendar Grid */}
        <MoodHeatmap entries={filteredEntries || []} daysToShow={rangeDays} />


        </div>
        <WellnessChecklist/>
      </div>
    </div>
  );
};

export default MoodDashboard;
