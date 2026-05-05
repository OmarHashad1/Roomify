import { useState } from "react";
import { Wrench, Edit, Check } from "lucide-react";

function HotelCard({ hotel, setHotel, onAction, isNew }) {
  const [editing, setEditing] = useState(isNew || !hotel.name);
  const [saved, setSaved] = useState(false);

const handleChange = (e) => {
  const { name, value, type, files } = e.target;
  if (type === "file" && files[0]) {
    setHotel({
      ...hotel,
      [name]: URL.createObjectURL(files[0])
    });
  } else if (name === "amenities") {
    setHotel({
      ...hotel,
      amenities: value.split(",").map(item => item.trim())
    });
  } else if (name === "rating") {
    setHotel({
      ...hotel,
      [name]: parseInt(value) || 0
    });
  } else {
    setHotel({
      ...hotel,
      [name]: value
    });
  }
};


  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    onAction("save");
  };

 

  const handleCancel = () => {
    if (isNew) {
      onAction("cancel");
    } else {
      setEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
      <div className="relative">
        <img
          src={hotel.image || "https://via.placeholder.com/400x300?text=No+Image"}
          alt="hotel"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
          className="w-full h-72 object-cover"
        />

        {saved && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
            <Check size={16} /> Saved
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        {editing ? (
          <input
            name="name"
            value={hotel.name}
            onChange={handleChange}
            placeholder="Hotel name"
            className="text-2xl font-bold border p-2 w-full rounded text-gray-700"
          />
        ) : (
          <h2 className="text-2xl font-bold text-[#0F2A44]">
            {hotel.name}
          </h2>
        )}

        <div className="text-gray-600">
          {editing ? (
            <>
              <input
                name="city"
                value={hotel.city}
                onChange={handleChange}
                placeholder="City"
                className="border p-2 w-full mb-2 rounded text-gray-700"
              />
              <input
                name="address"
                value={hotel.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 w-full rounded text-gray-700"
              />
              <input
                name="amenities"
                value={hotel.amenities.join(", ")}
                onChange={handleChange}
                placeholder="Amenities (comma-separated)"
                className="border p-2 w-full rounded text-gray-700"
              />
              <input
                name="rating"
                type="number"
                value={hotel.rating}
                onChange={handleChange}
                placeholder="Rating (0-5)"
                className="border p-2 w-full rounded text-gray-700"
                min="0"
                max="5"
              />
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="border p-2 w-full rounded text-gray-700"
              />
            </>
          ) : (
            <>
              <p>{hotel.city}</p>
              <p>{hotel.address}</p>
            </>
          )}
        </div>

        <p className="text-sm"> {hotel.rating} Stars</p>

        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((item, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          {editing ? (
            <div className="flex justify-between w-full">
              <button
                onClick={handleSave}
                className="bg-[#1E6F9F] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#155a82]"
              >
                <Wrench size={16} />
                Save Changes
              </button>

              {isNew && (
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-[#1E6F9F]"
                >
                  <Edit size={16} />
                  Edit
                </button>

                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
