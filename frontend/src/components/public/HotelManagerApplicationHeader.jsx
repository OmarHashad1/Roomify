import { Badge } from "@/components/ui/badge";

function HotelManagerApplicationHeader() {
  return (
    <div className="space-y-3">
      <Badge variant="secondary">Partner with Roomify</Badge>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
        Apply as a hotel manager
      </h1>
      <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
        Fill out your details to send your request for admin review.
      </p>
    </div>
  );
}

export default HotelManagerApplicationHeader;
