function SuggestionsCard() {
  const suggestions = [
    "Improve WiFi speed in rooms",
    "Add more vegetarian options in restaurant",
    "Train staff for faster check-in",
    "Increase cleanliness in pool area",
    "Offer more local tours and activities",
    "Upgrade gym equipment",
    "Provide better soundproofing in rooms",
    "Extend breakfast hours on weekends",
    "Add more charging stations in lobby",
    "Offer shuttle service to nearby attractions",
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
      <h2 className="text-lg font-bold text-[#0F2A44] mb-4">
        Suggestions
      </h2>

      <ul className="space-y-2 text-sm text-gray-700">
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="bg-gray-100 p-2 rounded"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionsCard;
