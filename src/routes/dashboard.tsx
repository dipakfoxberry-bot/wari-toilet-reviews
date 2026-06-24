import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { TOILETS, getAllRatings, type Rating } from "@/lib/toilets";
import { ToiletMapLazy } from "@/components/ToiletMapLazy";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import wariBg from "@/assets/wari-bg-2.jpg";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "डॅशबोर्ड | वारी शौचालय" },
      { name: "description", content: "वारी पुणे शौचालय मूल्यांकन डॅशबोर्ड." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filter, setFilter] = useState<"all" | "Male" | "Female">("all");

  useEffect(() => {
    setRatings(getAllRatings());
  }, []);

  const stats = useMemo(() => {
    const byToilet = new Map<string, Rating[]>();
    ratings.forEach((r) => {
      if (!byToilet.has(r.toiletId)) byToilet.set(r.toiletId, []);
      byToilet.get(r.toiletId)!.push(r);
    });

    const filtered = ratings.filter((r) => {
      if (filter === "all") return true;
      const t = TOILETS.find((x) => x.uniqueId === r.toiletId);
      return t?.type === filter;
    });

    const avg = (key: keyof Rating) =>
      filtered.length
        ? filtered.reduce((s, r) => s + (r[key] as number), 0) / filtered.length
        : 0;

    const male = ratings.filter((r) => TOILETS.find((t) => t.uniqueId === r.toiletId)?.type === "Male");
    const female = ratings.filter((r) => TOILETS.find((t) => t.uniqueId === r.toiletId)?.type === "Female");

    const poorWater = ratings.filter((r) => r.water <= 2).length;
    const poorDoor = ratings.filter((r) => r.door <= 2).length;
    const poorLight = ratings.filter((r) => r.light <= 2).length;
    const poorClean = ratings.filter((r) => r.cleanliness <= 2).length;

    const mapItems = TOILETS.map((t) => {
      const rs = byToilet.get(t.uniqueId) || [];
      return {
        toilet: t,
        count: rs.length,
        avgOverall: rs.length ? rs.reduce((s, r) => s + r.overall, 0) / rs.length : 0,
      };
    });

    const topClean = [...mapItems].filter((x) => x.count > 0).sort((a, b) => b.avgOverall - a.avgOverall).slice(0, 5);
    const worstClean = [...mapItems].filter((x) => x.count > 0).sort((a, b) => a.avgOverall - b.avgOverall).slice(0, 5);

    return {
      total: ratings.length,
      maleCount: male.length,
      femaleCount: female.length,
      avgOverall: avg("overall"),
      avgClean: avg("cleanliness"),
      avgWater: avg("water"),
      avgLight: avg("light"),
      avgDoor: avg("door"),
      poorWater, poorDoor, poorLight, poorClean,
      mapItems, topClean, worstClean,
      maleAvg: male.length ? male.reduce((s, r) => s + r.overall, 0) / male.length : 0,
      femaleAvg: female.length ? female.reduce((s, r) => s + r.overall, 0) / female.length : 0,
    };
  }, [ratings, filter]);

  const metricData = [
    { name: "स्वच्छता", value: +stats.avgClean.toFixed(2) },
    { name: "पाणी", value: +stats.avgWater.toFixed(2) },
    { name: "दिवा", value: +stats.avgLight.toFixed(2) },
    { name: "दरवाजा", value: +stats.avgDoor.toFixed(2) },
    { name: "एकूण", value: +stats.avgOverall.toFixed(2) },
  ];

  const issueData = [
    { name: "पाणी", value: stats.poorWater },
    { name: "दरवाजा", value: stats.poorDoor },
    { name: "दिवा", value: stats.poorLight },
    { name: "स्वच्छता", value: stats.poorClean },
  ];

  const genderData = [
    { name: "पुरुष", value: stats.maleCount },
    { name: "स्त्री", value: stats.femaleCount },
  ];
  const COLORS = ["#f97316", "#ec4899"];

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 pointer-events-none"
        style={{ backgroundImage: `url(${wariBg})` }}
      />
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-block bg-orange-600 text-white px-3 py-0.5 rounded-full text-xs font-semibold mb-2">
              ॥ वारी पुणे २०२६ ॥
            </div>
            <h1 className="text-3xl font-bold text-orange-950">शौचालय डॅशबोर्ड</h1>
            <p className="text-orange-800/80 text-sm">सर्व मूल्यांकनांचे विश्लेषण</p>
          </div>
        </header>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Kpi label="एकूण मूल्यांकन" value={stats.total} color="bg-orange-500" />
          <Kpi label="पुरुष शौचालय" value={stats.maleCount} sub={`सरासरी ${stats.maleAvg.toFixed(1)}★`} color="bg-blue-500" />
          <Kpi label="स्त्री शौचालय" value={stats.femaleCount} sub={`सरासरी ${stats.femaleAvg.toFixed(1)}★`} color="bg-pink-500" />
          <Kpi label="सरासरी रेटिंग" value={stats.avgOverall.toFixed(1) + "★"} color="bg-amber-500" />
        </div>

        {/* Issue cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Issue label="कमी पाणी पुरवठा" value={stats.poorWater} />
          <Issue label="खराब दरवाजे" value={stats.poorDoor} />
          <Issue label="अंधार / दिवा नाही" value={stats.poorLight} />
          <Issue label="अस्वच्छ" value={stats.poorClean} />
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {(["all", "Male", "Female"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f ? "bg-orange-600 text-white" : "bg-white text-orange-900 border border-orange-300"
              }`}
            >
              {f === "all" ? "सर्व" : f === "Male" ? "पुरुष" : "स्त्री"}
            </button>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <Card title="सरासरी गुणांकन">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="समस्या वितरण">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issueData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#dc2626" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="लिंगानुसार मूल्यांकन">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Radar + Map */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <Card title="गुणवत्ता प्रोफाइल">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={metricData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                <Radar dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <div className="lg:col-span-2">
            <Card title="शौचालय नकाशा (हिरवा = स्वच्छ, लाल = अस्वच्छ)">
              <ToiletMapLazy items={stats.mapItems} />
            </Card>
          </div>
        </div>

        {/* Top / worst */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card title="🏆 सर्वात स्वच्छ शौचालये">
            <ul className="space-y-2">
              {stats.topClean.length === 0 && <li className="text-sm text-muted-foreground">अद्याप डेटा नाही</li>}
              {stats.topClean.map((x) => (
                <li key={x.toilet.uniqueId} className="flex justify-between items-center bg-green-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">{x.toilet.name}</span>
                  <span className="text-green-700 font-bold">{x.avgOverall.toFixed(1)} ★</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="⚠️ लक्ष देणे आवश्यक">
            <ul className="space-y-2">
              {stats.worstClean.length === 0 && <li className="text-sm text-muted-foreground">अद्याप डेटा नाही</li>}
              {stats.worstClean.map((x) => (
                <li key={x.toilet.uniqueId} className="flex justify-between items-center bg-red-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">{x.toilet.name}</span>
                  <span className="text-red-700 font-bold">{x.avgOverall.toFixed(1)} ★</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recent comments */}
        <Card title="अलीकडील टिप्पण्या">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {ratings.filter((r) => r.comment).slice(-10).reverse().map((r) => {
              const t = TOILETS.find((x) => x.uniqueId === r.toiletId);
              return (
                <div key={r.id} className="border-l-4 border-orange-400 bg-orange-50/50 px-3 py-2 rounded">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{t?.name}</span>
                    <span>{r.overall} ★</span>
                  </div>
                  <p className="text-sm">{r.comment}</p>
                </div>
              );
            })}
            {ratings.filter((r) => r.comment).length === 0 && (
              <p className="text-sm text-muted-foreground">अद्याप टिप्पण्या नाहीत</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, color }: { label: string; value: React.ReactNode; sub?: string; color: string }) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow border border-orange-100">
      <div className={`w-10 h-1 ${color} rounded-full mb-2`} />
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="text-2xl font-bold text-orange-950">{value}</div>
      {sub && <div className="text-xs text-orange-700 mt-0.5">{sub}</div>}
    </div>
  );
}

function Issue({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="text-xs text-red-700 font-medium">{label}</div>
      <div className="text-2xl font-bold text-red-800">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow border border-orange-100">
      <h3 className="font-semibold text-orange-950 mb-3">{title}</h3>
      {children}
    </div>
  );
}
