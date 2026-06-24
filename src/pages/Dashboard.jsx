import React from "react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

import {
  FaToilet,
  FaTint,
  FaDoorOpen,
  FaLightbulb,
  FaStar
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const COLORS = ["#2563eb", "#ec4899"];

const toilets = [
  {
    id: "T001",
    name: "वारजे शौचालय",
    lat: 18.5089,
    lng: 73.8077,
  },
  {
    id: "T002",
    name: "हडपसर शौचालय",
    lat: 18.4966,
    lng: 73.9419,
  },
  {
    id: "T003",
    name: "कात्रज शौचालय",
    lat: 18.4575,
    lng: 73.8508,
  },
  {
    id: "T004",
    name: "स्वारगेट शौचालय",
    lat: 18.5018,
    lng: 73.8636,
  }
];

export default function Dashboard() {
  const stats = {
    total: 1245,
    avgRating: 4.2,
    male: 723,
    female: 522,
    poorWater: 45,
    poorDoor: 21,
    poorLight: 35,
    poorClean: 17
  };

  const genderData = [
    { name: "पुरुष", value: stats.male },
    { name: "महिला", value: stats.female }
  ];

  const trendData = [
    { day: "Mon", value: 120 },
    { day: "Tue", value: 180 },
    { day: "Wed", value: 240 },
    { day: "Thu", value: 320 },
    { day: "Fri", value: 280 },
    { day: "Sat", value: 400 },
    { day: "Sun", value: 520 }
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-3xl font-bold">
          🚩 वारी पुणे २०२६ शौचालय विश्लेषण डॅशबोर्ड
        </h1>
        <p className="opacity-90">
          Toilet Rating & Monitoring System
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FaToilet />}
          title="एकूण मूल्यांकन"
          value={stats.total}
        />

        <StatCard
          icon={<FaStar />}
          title="सरासरी रेटिंग"
          value={stats.avgRating}
        />

        <StatCard
          icon="♂️"
          title="पुरुष शौचालय"
          value={stats.male}
        />

        <StatCard
          icon="♀️"
          title="महिला शौचालय"
          value={stats.female}
        />
      </div>

      {/* Issue Cards */}

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <IssueCard
          title="कमी पाणी"
          value={stats.poorWater}
          icon={<FaTint />}
        />

        <IssueCard
          title="खराब दरवाजा"
          value={stats.poorDoor}
          icon={<FaDoorOpen />}
        />

        <IssueCard
          title="दिवा समस्या"
          value={stats.poorLight}
          icon={<FaLightbulb />}
        />

        <IssueCard
          title="अस्वच्छ"
          value={stats.poorClean}
          icon="🧹"
        />
      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold mb-4">
            दैनंदिन मूल्यांकन
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                dataKey="value"
                fill="#f97316"
                stroke="#ea580c"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold mb-4">
            पुरुष / महिला वितरण
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {genderData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

{/* Map */}

<div className="bg-white rounded-2xl shadow p-5 mb-6">
  <h3 className="font-bold text-lg mb-4">
    🗺️ शौचालय नकाशा
  </h3>

  <MapContainer
    center={[18.5204, 73.8567]}
    zoom={12}
    style={{
      height: "500px",
      width: "100%",
      borderRadius: "12px",
    }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    {toilets.map((toilet) => (
      <Marker
        key={toilet.id}
        position={[toilet.lat, toilet.lng]}
      >
        <Popup>
          <div>
            <strong>{toilet.name}</strong>
            <br />
            {toilet.id}
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>
</div>


      {/* Tables */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold text-green-700 mb-4">
            🏆 सर्वात स्वच्छ
          </h3>

          <table className="w-full">
            <tbody>
              <tr>
                <td>वारजे केंद्र</td>
                <td>4.9 ⭐</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold text-red-700 mb-4">
            ⚠️ सुधारणा आवश्यक
          </h3>

          <table className="w-full">
            <tbody>
              <tr>
                <td>हडपसर केंद्र</td>
                <td>1.9 ⭐</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="text-orange-600 text-2xl mb-2">
        {icon}
      </div>
      <div className="text-gray-500 text-sm">
        {title}
      </div>
      <div className="text-3xl font-bold">
        {value}
      </div>
    </div>
  );
}

function IssueCard({ title, value, icon }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
      <div className="text-red-600 text-xl mb-2">
        {icon}
      </div>
      <div className="text-red-700 text-sm">
        {title}
      </div>
      <div className="text-3xl font-bold text-red-800">
        {value}
      </div>
    </div>
  );
}