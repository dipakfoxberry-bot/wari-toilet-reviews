
import { useParams } from "react-router-dom";
import { useState } from "react";
import wariBg from "../assets/wari-bg.jpg";
import React from "react";

const TOILETS = [
    {
        uniqueId: "T001",
        name: "वारजे शौचालय",
        type: "Male",
    },
    {
        uniqueId: "T002",
        name: "हडपसर शौचालय",
        type: "Female",
    },
    {
        uniqueId: "T003",
        name: "कात्रज शौचालय",
        type: "Male",
    },
];

export default function RatePage() {
    const { id } = useParams();

    const toilet = TOILETS.find(
        (t) => t.uniqueId === id
    );

    const [cleanliness, setCleanliness] = useState(0);
    const [water, setWater] = useState(0);
    const [light, setLight] = useState(0);
    const [door, setDoor] = useState(0);
    const [overall, setOverall] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (!toilet) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">
                    शौचालय सापडले नाही
                </h1>
            </div>
        );
    }

    const saveRating = () => {
        const rating = {
            id: Date.now(),
            toiletId: toilet.uniqueId,
            toiletName: toilet.name,
            toiletType: toilet.type,
            cleanliness,
            water,
            light,
            door,
            overall,
            comment,
            createdAt: new Date().toISOString(),
        };

        const ratings = JSON.parse(
            localStorage.getItem("toiletRatings") || "[]"
        );

        ratings.push(rating);

        localStorage.setItem(
            "toiletRatings",
            JSON.stringify(ratings)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !cleanliness ||
            !water ||
            !light ||
            !door ||
            !overall
        ) {
            alert("कृपया सर्व गुणांकन भरा");
            return;
        }

        saveRating();
        setSubmitted(true);
    };

    const StarRating = ({
        label,
        value,
        onChange,
    }) => (
        <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow border border-orange-100">
            <label className="block text-base font-semibold text-orange-900 mb-3">
                {label}
            </label>

            <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`text-4xl transition ${star <= value
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed relative"
            style={{
                backgroundImage: `url(${wariBg})`,
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-50/85 via-amber-50/90 to-orange-100/95 backdrop-blur-sm" />

            <div className="relative max-w-2xl mx-auto px-4 py-8">

                <div className="text-center mb-6">
                    <div className="inline-block bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-semibold mb-2">
                        ॥ वारी पुणे २०२६ ॥
                    </div>

                    <h1 className="text-3xl font-bold text-orange-950">
                        शौचालय मूल्यांकन
                    </h1>

                    <p className="text-orange-800 mt-1 font-medium">
                        {toilet.name}
                    </p>

                    <div className="flex justify-center gap-3 mt-2 text-sm text-orange-900">
                        <span>ID : {toilet.uniqueId}</span>
                        <span>•</span>
                        <span>
                            {toilet.type === "Male"
                                ? "पुरुष"
                                : "स्त्री"}
                        </span>
                    </div>
                </div>

                {submitted ? (
                    <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
                        <div className="text-6xl mb-4">
                            🙏
                        </div>

                        <h2 className="text-2xl font-bold text-green-800">
                            धन्यवाद!
                        </h2>

                        <p className="text-green-700 mt-2">
                            तुमचे मूल्यांकन यशस्वीरित्या
                            सबमिट झाले आहे.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <StarRating
                            label="स्वच्छता"
                            value={cleanliness}
                            onChange={setCleanliness}
                        />

                        <StarRating
                            label="पाणी पुरवठा"
                            value={water}
                            onChange={setWater}
                        />

                        <StarRating
                            label="दिवा / प्रकाश"
                            value={light}
                            onChange={setLight}
                        />

                        <StarRating
                            label="दरवाजा"
                            value={door}
                            onChange={setDoor}
                        />

                        <StarRating
                            label="एकूण गुणांकन"
                            value={overall}
                            onChange={setOverall}
                        />

                        <div className="bg-white/90 rounded-xl p-4 shadow border border-orange-100">
                            <label className="block text-base font-semibold mb-2">
                                टिप्पणी (पर्यायी)
                            </label>

                            <textarea
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.target.value)
                                }
                                rows={4}
                                placeholder="तुमचा अभिप्राय येथे लिहा..."
                                className="w-full border rounded-lg p-3"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg"
                        >
                            सबमिट करा
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

