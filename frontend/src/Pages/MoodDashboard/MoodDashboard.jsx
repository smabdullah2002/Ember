import React, { useEffect, useMemo } from 'react';
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

  // hydrate from localStorage if empty
  useEffect(() => {
    if (!wellnessData || wellnessData.length === 0) {
      const saved = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      if (saved?.length) setWellnessData(saved);
    }
  }, [wellnessData, setWellnessData]);

  const byDate = useMemo(() => groupByDate(wellnessData || []), [wellnessData]);
  const lineData = useMemo(() => aggregateDaily(byDate), [byDate]);
  const pieData = useMemo(() => pieDistribution(wellnessData || []), [wellnessData]);



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
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4 sm:p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Mood Intensity Trend</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip />
                  <Line type="monotone" dataKey="intensity" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <ChartPie className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Mood Distribution</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
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
        <MoodHeatmap/>


        </div>
      </div>
    </div>
  );
};

export default MoodDashboard;
