import { useRef } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhotoPreview from "@/components/Manager/PhotoPreview";

function RoomPhotoUpload({
  mainPhoto,
  photos,
  photoFiles = [],
  onMainPhotoChange,
  onMainPhotoFileChange,
  onPhotosChange,
  onPhotoFilesChange,
}) {
  const mainInputRef = useRef(null);
  const extraInputRef = useRef(null);

  function handleMainFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    onMainPhotoChange(URL.createObjectURL(file));
    onMainPhotoFileChange?.(file);
    e.target.value = "";
  }

  function handleExtraFileChange(e) {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    onPhotosChange([...photos, ...urls]);
    onPhotoFilesChange?.([...photoFiles, ...files]);
    e.target.value = "";
  }

  function removeExtraPhoto(index) {
    onPhotosChange(photos.filter((_, i) => i !== index));
    onPhotoFilesChange?.(photoFiles.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {/* Main Photo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Main Photo</label>
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="w-full sm:w-48 shrink-0">
            <PhotoPreview
              src={mainPhoto}
              label="Main photo"
              onRemove={
                mainPhoto
                  ? () => {
                      onMainPhotoChange("");
                      onMainPhotoFileChange?.(null);
                    }
                  : null
              }
            />
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              placeholder="Paste image URL…"
              value={mainPhoto}
              onChange={(e) => onMainPhotoChange(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
            />
            <p className="text-xs text-muted-foreground">or</p>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMainFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => mainInputRef.current?.click()}
            >
              <Upload className="size-4" />
              Upload from device
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Photos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Additional Photos
            <span className="ml-1.5 text-muted-foreground font-normal">
              ({photos.length})
            </span>
          </label>
          <input
            ref={extraInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleExtraFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => extraInputRef.current?.click()}
          >
            <ImagePlus className="size-4" />
            Add Photos
          </Button>
        </div>

        {photos.length === 0 ? (
          <div className="rounded-md border-2 border-dashed border-border py-8 flex flex-col items-center justify-center text-center">
            <ImagePlus className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No additional photos yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload photos to showcase your room
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((src, i) => (
              <PhotoPreview
                key={i}
                src={src}
                label={`Photo ${i + 1}`}
                onRemove={() => removeExtraPhoto(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomPhotoUpload;
