import { useState } from "react";
import { toast } from "sonner";

function ReportReasons({ onClose }) {
  const [selected, setSelected] = useState([]);

  const reasons = [
    "Inappropriate language",
    "Spam or fake review",
    "Irrelevant content",
    "Personal information",
    "Conflict of interest"
  ];

  const toggleReason = (reason) => {
    setSelected((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      toast.warning("Select at least one reason");
      return;
    }

    toast("Review reported");
    setSelected([]);
    onClose();
  };

  return (
    <div className="mt-4 border-t pt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
      {reasons.map((reason, index) => (
        <label key={index} className="block text-sm">
          <input
            type="checkbox"
            onChange={(e) => {
              e.stopPropagation();
              toggleReason(reason);
            }}
          />{" "}
          {reason}
        </label>
      ))}

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSubmit();
        }}
        className="mt-2 bg-[#1E6F9F] text-white px-3 py-1 rounded"
      >
        Submit Report
      </button>
    </div>
  );
}

export default ReportReasons;
