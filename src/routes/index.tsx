import { createFileRoute, Link } from "@tanstack/react-router";
import { TOILETS } from "@/lib/toilets";
import wariBg from "@/assets/wari-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "वारी शौचालय मूल्यांकन | पुणे" },
      { name: "description", content: "पंढरपूर वारीदरम्यान पुण्यातील शौचालयांचे मूल्यांकन करा." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${wariBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/85 via-amber-50/90 to-orange-100/95" />
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-8">
          <div className="inline-block bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-semibold mb-3 tracking-widest">
            ॥ श्री विठ्ठल ॥ वारी पुणे २०२६
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-orange-950 mb-2">
            शौचालय मूल्यांकन
          </h1>
          <p className="text-orange-800 max-w-xl mx-auto">
            पंढरपूर वारीसाठी पुण्यातील सार्वजनिक शौचालयांचे गुणांकन करा आणि स्वच्छ वारी मोहिमेला हातभार लावा.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Link
              to="/dashboard"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium shadow"
            >
              डॅशबोर्ड पहा →
            </Link>
            <a
              href="/api/download-code"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium shadow"
            >
              ⬇ कोड डाउनलोड करा (ZIP)
            </a>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 gap-3">
          {TOILETS.map((t) => (
            <Link
              key={t.uniqueId}
              to="/rate/$id"
              params={{ id: t.uniqueId }}
              className="bg-white/90 backdrop-blur rounded-xl p-4 shadow hover:shadow-lg hover:-translate-y-0.5 transition border border-orange-200 flex justify-between items-center group"
            >
              <div>
                <div className="text-xs text-orange-700 font-mono">{t.uniqueId}</div>
                <div className="font-semibold text-orange-950">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {t.type === "Male" ? "पुरुष" : "स्त्री"} • {t.latitude.toFixed(3)}, {t.longitude.toFixed(3)}
                </div>
              </div>
              <span className="text-orange-600 group-hover:translate-x-1 transition text-xl">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
