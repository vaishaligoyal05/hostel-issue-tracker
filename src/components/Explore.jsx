import React from 'react';

const Explore = () => {
  const photos = [
    "/photos/img1.jpeg",
    "/photos/img2.jpeg",
    "/photos/img3.jpeg",
    "/photos/img2.jpeg",
    "/photos/img3.jpeg",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Explore Hostel</h2>
      <p className="mb-4 text-gray-600">Take a glimpse of Mai Bhago Hostel life!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Hostel ${index + 1}`}
            className="rounded-lg shadow-md object-cover w-full h-60"
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;
