import { ImagePlus, X } from "lucide-react";
import roomPlaceholder from "@/static/placeholders/room-type-photo-placeholder.jpg";

function PhotoPreview({ src, label, onRemove }) {
  return (
    <div className="relative group">
      {src ? (
        <img
          src={src}
          alt={label}
          onError={(e) => { e.currentTarget.src = roomPlaceholder; }}
          className="w-full h-32 object-cover rounded-md border border-border"
        />
      ) : (
        <div className="w-full h-32 rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/30">
          <ImagePlus className="size-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-1">No photo</p>
        </div>
      )}
      {src && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Remove ${label}`}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

export default PhotoPreview;
