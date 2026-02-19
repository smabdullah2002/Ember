import { useState, useEffect } from "react";
import axios from 'axios';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);
const API_BASE = "http://localhost:8000";

const taskIcons = ["🌸", "💧", "🌿", "☀️", "🫧", "🌙", "🍃", "🌱"];

export default function WellnessChecklist({ userId }) {
    const [checklist, setChecklist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [animatingId, setAnimatingId] = useState(null);

    useEffect(() => {
        fetchChecklist();
    }, [userId]);

    const fetchChecklist = async () => {
        try {
            const { data } = await supabase.auth.getSession();
            const token = data.session.access_token;
            const res = await axios.get("http://127.0.0.1:8000/checklist",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const list = res.data;
            console.log("Fetched checklist:", list);
            setChecklist(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = async (index) => {
        if (!checklist?.items) return;

        const { data } = await supabase.auth.getSession();
        const token = data.session.access_token;

        setAnimatingId(index);
        setTimeout(() => setAnimatingId(null), 300);

        const updated = checklist.items.map((item, i) =>
            i === index ? { ...item, completed: !item.completed } : item
        );
        setChecklist({ ...checklist, items: updated });

        try {
            await axios.patch(
                `${API_BASE}/checklist/update`,
                { items: updated },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (e) {
            console.error("Error updating checklist:", e);
            setChecklist(checklist); // revert on failure
        }
    };

    const items = checklist?.items || [];
    const completed = items.filter((i) => i.completed).length;
    const total = items.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const routineName = checklist?.routine_name || "Daily Ritual";
    const [firstName, ...rest] = routineName.split(" ");

    return (
        <div className="relative overflow-hidden bg-pink-50 border border-pink-100 rounded-3xl p-7 w-full max-w-md shadow-lg">

            {/* Header */}
            <div className="mb-5 relative">
                <p className="text-xs font-medium tracking-widest uppercase text-purple-600 mb-2">
                    ✦ Wellness
                </p>
                <h2 className="text-2xl font-serif text-purple-900 leading-tight">
                    {firstName}{" "}
                    <span className="italic text-pink-500">
                        {rest.join(" ") || "Ritual"}
                    </span>
                </h2>
                <p className="text-md text-pink-400 font-medium mt-0.5">{today}</p>
            </div>

            {/* Progress */}
            {!loading && total > 0 && (
                <div className="mb-5">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-4xl font-serif text-purple-900">
                            {completed}
                            <span className="text-xl font-sans font-light text-pink-600 ml-1">
                                / {total} done
                            </span>
                        </span>
                        <span className="text-xs font-medium text-purple-400">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-pink-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-pink-300 via-fuchsia-300 to-purple-400 transition-all duration-700 ease-in-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent mb-5" />

            {/* Content */}
            {loading ? (
                <div className="flex justify-center gap-1.5 py-8">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            ) : total === 0 ? (
                <div className="text-center py-8 text-pink-300">
                    <div className="text-4xl mb-3 opacity-60">🌱</div>
                    <p className="text-sm leading-relaxed">No checklist yet for today.</p>
                    <p className="text-sm">Ask the chatbot for a wellness plan!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2.5">
                    {items.map((item, i) => (
                        <div
                            key={item.id ?? i}
                            onClick={() => toggleItem(i)}
                            className={[
                                "relative overflow-hidden flex items-center gap-3 px-3.5 py-3 rounded-2xl border cursor-pointer transition-all duration-200",
                                item.completed
                                    ? "bg-purple-50 border-purple-200"
                                    : "bg-white border-pink-200 hover:border-pink-300 hover:shadow-sm hover:translate-x-1",
                                animatingId === i ? "scale-95" : "",
                            ].join(" ")}
                        >
                            {/* Icon */}
                            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 text-lg flex-shrink-0">
                                {taskIcons[i % taskIcons.length]}
                            </div>

                            {/* Task text */}
                            <p
                                className={`flex-1 text-md font-semibold leading-snug transition-all duration-200 ${item.completed
                                    ? "line-through text-purple-300"
                                    : "text-purple-800"
                                    }`}
                            >
                                {item.task}
                            </p>

                            {/* Checkbox */}
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${item.completed
                                    ? "bg-gradient-to-br from-pink-400 to-purple-400 border-transparent"
                                    : "border-pink-300 bg-transparent"
                                    }`}
                            >
                                {item.completed && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path
                                            d="M1 4L3.5 6.5L9 1"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <p
                className={`mt-5 text-center text-xs italic font-serif transition-colors duration-500 ${completed === total && total > 0 ? "text-purple-400" : "text-pink-300"
                    }`}
            >
                {completed === total && total > 0
                    ? "✦ You've completed today's ritual ✦"
                    : "small steps, every day"}
            </p>
        </div>
    );
}