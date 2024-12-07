import React from "react";
import Card from "./Card"; // Import Card as default
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Swr = () => {
  const {
    data: cardsData,
    error,
    isValidating,
  } = useSWR('https://localhost:7034/api/Home/profiles', fetcher);

  if (error) return <div className="failed">Failed to load</div>;
  if (isValidating) return <div className="Loading">Loading...</div>;

  return (
    <main className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4">Welcome to My App</h2>
      <div className="flex flex-col justify-center items-center bg-gray-100 min-h-screen space-y-4">
        {cardsData && cardsData.length > 0 ? (
          cardsData.map((card) => (
            <Card
              photoUrl={card.photoUrl}
              bio={card.bio}
            />
          ))
        ) : (
          <div>No profiles found.</div>
        )}
      </div>
    </main>
  );
};

export default Swr;