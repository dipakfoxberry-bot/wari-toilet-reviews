import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getToilet, saveRating } from "@/lib/toilets";
import { StarRating } from "@/components/StarRating";
import wariBg from "@/assets/wari-bg.jpg";

export const Route = createFileRoute("/rate/$id")({
  head: () => ({
    meta: [
      { title: "शौचालय मूल्यांकन | वारी पुणे" },
      { name: "description", content: "वारीसाठी पुण्यातील शौचालयांचे मूल्यांकन करा." },
    ],
  }),
  component: RatePage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">शौचालय सापडले नाही</div>
  ),
});

function RatePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const toilet = getToilet(id);

  const [cleanliness, setCleanliness] = useState(0);
  const [water, setWater] = useState(0);
  const [light, setLight] = useState(0);
  const [door, setDoor] = useState(0);
  const [overall, setOverall] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!toilet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold">शौचालय सापडले नाही</h1>
        <p className="text-muted-foreground">ID: {id}</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanliness || !water || !light || !door || !overall) {
      alert("कृपया सर्व गुणांकन भरा");
      return;
    }
    saveRating({ toiletId: toilet.uniqueId, cleanliness, water, light, door, overall, comment });
    setSubmitted(true);
    // setTimeout(() => navigate({ to: "/dashboard" }), 1500);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${wariBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/85 via-amber-50/90 to-orange-100/95 backdrop-blur-sm" />
      <div className="relative max-w-2xl mx-auto px-4 py-8">

        <div className="text-center mb-6">
          <div className="inline-block bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-semibold mb-2 tracking-wide">
            ॥ वारी पुणे २०२६ ॥
          </div>
          <h1 className="text-3xl font-bold text-orange-950">शौचालय मूल्यांकन</h1>
          <p className="text-orange-800 mt-1 font-medium">{toilet.name}</p>
          <div className="flex items-center justify-center gap-3 mt-2 text-sm text-orange-900/80">
            <span>ID: {toilet.uniqueId}</span>
            <span>•</span>
            <span>{toilet.type === "Male" ? "पुरुष" : "स्त्री"}</span>
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
            <div className="text-5xl mb-3">🙏</div>
            <h2 className="text-2xl font-bold text-green-800">धन्यवाद!</h2>
            <p className="text-green-700 mt-2">तुमचे मूल्यांकन सबमिट झाले आहे.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <StarRating label="स्वच्छता" value={cleanliness} onChange={setCleanliness} />
            <StarRating label="पाणी पुरवठा" value={water} onChange={setWater} />
            <StarRating label="दिवा / प्रकाश" value={light} onChange={setLight} />
            <StarRating label="दरवाजा" value={door} onChange={setDoor} />
            <StarRating label="एकूण गुणांकन" value={overall} onChange={setOverall} />

            <div className="rounded-lg bg-card/80 backdrop-blur p-4 border border-border">
              <label className="block text-base font-medium mb-2">टिप्पणी (पर्यायी)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="तुमचा अभिप्राय येथे लिहा..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-colors"
            >
              सबमिट करा
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
