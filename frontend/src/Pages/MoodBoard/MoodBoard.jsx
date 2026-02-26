import React, { useEffect, useMemo, useState } from 'react';
import { NotebookPen, CalendarDays, Sparkles, Trash2, Plus } from 'lucide-react';
import UseStore from '@/store/UseStore';
import axios from 'axios';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const API_BASE = 'http://127.0.0.1:8000';

// Modern mood board page with emoji selection, journaling, and recent entries
const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'from-amber-400 to-yellow-400' },
  { id: 'surprised', label: 'Surprised', emoji: '😮', color: 'from-sky-400 to-cyan-400' },
  { id: 'angry', label: 'Angry', emoji: '😡', color: 'from-red-500 to-orange-500' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'from-blue-400 to-indigo-400' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: 'from-teal-400 to-emerald-400' },
  { id: 'love', label: 'Loved', emoji: '🥰', color: 'from-pink-500 to-rose-500' },
  { id: 'anxious', label: 'Anxious', emoji: '😬', color: 'from-violet-500 to-purple-500' },
  { id: 'proud', label: 'Proud', emoji: '😇', color: 'from-fuchsia-500 to-purple-500' },
];

const MoodBoard = () => {
  const { wellnessData, setWellnessData } = UseStore();
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5); // 1-10 slider
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [boardError, setBoardError] = useState('');

  const mapApiEntryToStoreEntry = (entry) => ({
    id: entry.id,
    date: entry.created_at,
    moodId: entry.mood_label ? entry.mood_label.toLowerCase() : null,
    moodLabel: entry.mood_label || null,
    emoji: entry.emoji || null,
    intensity: entry.intensity || 0,
    note: entry.note || null,
  });

  const fetchMoodEntries = async () => {
    setLoadingEntries(true);
    setBoardError('');
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
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
    } catch (error) {
      console.error('Error fetching mood entries:', error.response?.data || error.message);
      setBoardError('Could not load mood entries. Please try again.');
    } finally {
      setLoadingEntries(false);
    }
  };

  // Load existing entries from backend
  useEffect(() => {
    fetchMoodEntries();
  }, [setWellnessData]);

  // Persist to localStorage when store changes
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(wellnessData || []));
  }, [wellnessData]);

  const entriesCount = wellnessData?.length || 0;
  const today = useMemo(() => new Date().toLocaleDateString(), []);

  const todaysEntries = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return (wellnessData || []).filter((e) => new Date(e.date) >= start).length;
  }, [wellnessData]);

  const avgIntensity = useMemo(() => {
    if (!wellnessData?.length) return 0;
    return Math.round(wellnessData.reduce((sum, e) => sum + (e.intensity || 0), 0) / wellnessData.length);
  }, [wellnessData]);

  const canSubmit = selectedMood || note.trim().length > 0;

  const handleClear = () => {
    setSelectedMood(null);
    setNote('');
    setIntensity(5);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const moodMeta = moods.find(m => m.id === selectedMood) || null;

    try {
      setSubmitting(true);
      setBoardError('');
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
        alert('Please log in to save mood entries.');
        return;
      }

      const payload = {
        mood_id: null,
        mood_label: moodMeta?.label || null,
        emoji: moodMeta?.emoji || null,
        intensity,
        note: note.trim() || null,
      };

      const response = await axios.post(`${API_BASE}/mood-entries`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const savedEntry = mapApiEntryToStoreEntry(response?.data?.entry);
      setWellnessData([savedEntry, ...(wellnessData || [])]);
      handleClear();
    } catch (error) {
      console.error('Error saving mood entry:', error.response?.data || error.message);
      setBoardError('Could not save mood entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this mood entry?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setBoardError('');
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
        alert('Please log in to delete mood entries.');
        return;
      }

      await axios.delete(`${API_BASE}/mood-entries/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const next = (wellnessData || []).filter(e => e.id !== id);
      setWellnessData(next);
    } catch (error) {
      console.error('Error deleting mood entry:', error.response?.data || error.message);
      setBoardError('Could not delete mood entry. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60">
          <div className="flex items-center justify-between p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center shadow-md">
                <NotebookPen className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-purple-700">MoodBoard</h1>
                <p className="text-gray-500">Track your emotions and wellbeing journey</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                <CalendarDays className="w-4 h-4" /> {today}
              </p>
              <p className="mt-1">
                <span className="text-2xl font-bold text-purple-700">{entriesCount}</span>
                <span className="text-sm text-gray-500 ml-2">Entries</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4">
            <p className="text-sm text-gray-500">Today&apos;s logs</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{todaysEntries}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-4">
            <p className="text-sm text-gray-500">Average intensity</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{avgIntensity}/10</p>
          </div>
        </div>

        {boardError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
            <span>{boardError}</span>
            <button
              onClick={fetchMoodEntries}
              className="text-red-700 font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Composer */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800">How are you feeling today?</h2>
          <p className="text-gray-500 text-sm">Share your thoughts</p>

          <div className="mt-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe how you're feeling, what's on your mind, or what happened today..."
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 p-4 bg-white/80"
            />
          </div>

          {/* Mood picker */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Choose your mood</p>
            <div className="flex flex-wrap gap-3">
              {moods.map((m) => {
                const active = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`group relative w-14 h-14 rounded-2xl border transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md
                      ${active ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    title={m.label}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    {active && (
                      <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${m.color} text-white shadow`}>{m.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intensity slider */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Intensity</p>
              <span className="text-sm font-semibold text-purple-700">{intensity}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleClear}
              disabled={submitting}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md transition
                ${canSubmit && !submitting ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              <Plus className="w-5 h-5" /> {submitting ? 'Saving...' : 'Log Mood'}
            </button>
          </div>
        </div>

        {/* Recent entries */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100/60">
          <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Recent Mood Entries</h3>
          </div>

          {loadingEntries ? (
            <div className="p-10 sm:p-16 text-center">
              <p className="text-gray-500 text-sm">Loading mood entries...</p>
            </div>
          ) : entriesCount === 0 ? (
            <div className="p-10 sm:p-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center shadow">
                <NotebookPen className="w-8 h-8" />
              </div>
              <p className="mt-4 text-purple-700 font-semibold">No mood entries yet</p>
              <p className="text-gray-500 text-sm">Start tracking your emotions to see your mood journey!</p>
            </div>
          ) : (
            <ul className="p-6 sm:p-8 space-y-4">
              {(wellnessData || []).map((e) => (
                <li key={e.id} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity" />
                  <div className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 border border-purple-200/50 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                      {e.emoji || '📝'}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500">{new Date(e.date).toLocaleString()}</span>
                        {e.moodLabel && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                            {e.moodLabel} • {e.intensity}/10
                          </span>
                        )}
                      </div>
                      {e.note && (
                        <p className="mt-1 text-gray-700 text-sm leading-relaxed">{e.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      className="text-gray-500 hover:text-red-600 transition disabled:opacity-50"
                      title="Delete entry"
                    >
                      {deletingId === e.id ? '...' : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;
