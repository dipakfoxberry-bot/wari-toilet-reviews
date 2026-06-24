const STORAGE_KEY = "wari_toilet_ratings";

export const getRatings = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRating = (rating) => {
  const existing = getRatings();

  existing.push({
    ...rating,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing)
  );
};

export const getToiletRatings = (toiletId) => {
  return getRatings().filter(
    (x) => x.toiletId === toiletId
  );
};

export const averageRating = (toiletId) => {
  const ratings = getToiletRatings(toiletId);

  if (!ratings.length) return 0;

  return (
    ratings.reduce(
      (sum, item) => sum + item.overall,
      0
    ) / ratings.length
  ).toFixed(1);
};