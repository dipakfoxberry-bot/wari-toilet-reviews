export interface Toilet {
  uniqueId: string;
  name: string;
  type: "Male" | "Female";
  latitude: number;
  longitude: number;
}

export const TOILETS: Toilet[] = [
  { uniqueId: "T001", name: "Shivaji Nagar Public Toilet", type: "Male", latitude: 18.5308, longitude: 73.8476 },
  { uniqueId: "T002", name: "Kothrud Community Toilet", type: "Female", latitude: 18.5074, longitude: 73.8077 },
  { uniqueId: "T003", name: "Hadapsar Sanitation Center", type: "Male", latitude: 18.4966, longitude: 73.9418 },
  { uniqueId: "T004", name: "Aundh Public Convenience", type: "Female", latitude: 18.5592, longitude: 73.8075 },
  { uniqueId: "T005", name: "Baner Smart Toilet", type: "Male", latitude: 18.5679, longitude: 73.7798 },
  { uniqueId: "T006", name: "Wakad Civic Toilet", type: "Female", latitude: 18.5991, longitude: 73.7645 },
  { uniqueId: "T007", name: "Kharadi Utility Block", type: "Male", latitude: 18.5515, longitude: 73.9472 },
  { uniqueId: "T008", name: "Viman Nagar Restroom", type: "Female", latitude: 18.5671, longitude: 73.9143 },
  { uniqueId: "T009", name: "Warje Public Facility", type: "Male", latitude: 18.4897, longitude: 73.7994 },
  { uniqueId: "T010", name: "Pashan Eco Toilet", type: "Female", latitude: 18.5412, longitude: 73.7928 },
  { uniqueId: "T011", name: "Sinhagad Road Toilet Complex", type: "Male", latitude: 18.4625, longitude: 73.8231 },
  { uniqueId: "T012", name: "Koregaon Park Public Toilet", type: "Female", latitude: 18.5364, longitude: 73.8942 },
  { uniqueId: "T013", name: "Yerawada Sanitation Hub", type: "Male", latitude: 18.5538, longitude: 73.8789 },
  { uniqueId: "T014", name: "Bavdhan Public Convenience", type: "Female", latitude: 18.5153, longitude: 73.7734 },
  { uniqueId: "T015", name: "Magarpatta Civic Restroom", type: "Male", latitude: 18.5169, longitude: 73.9287 },
];

export const getToilet = (id: string) => TOILETS.find((t) => t.uniqueId === id);

export interface Rating {
  id: string;
  toiletId: string;
  cleanliness: number;
  water: number;
  light: number;
  door: number;
  overall: number;
  comment: string;
  createdAt: number;
}

const KEY = "wari_toilet_ratings_v1";

export function getAllRatings(): Rating[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRating(r: Omit<Rating, "id" | "createdAt">): Rating {
  const all = getAllRatings();
  const full: Rating = { ...r, id: crypto.randomUUID(), createdAt: Date.now() };
  all.push(full);
  localStorage.setItem(KEY, JSON.stringify(all));
  return full;
}
