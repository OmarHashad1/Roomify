import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_STYLES = {
  under_review: "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

function HotelManagerApplicationStatusCard({ application }) {
  const status = application?.status ?? null;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Application Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!application ? (
          <p className="text-sm text-muted-foreground">
            No application submitted yet. Complete the form to send your
            request for review.
          </p>
        ) : (
          <>
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Current Status
              </p>
              <Badge className={STATUS_STYLES[status] ?? STATUS_STYLES.under_review}>
                {(status ?? "under_review").toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Hotel Name
              </p>
              <p className="text-sm font-medium">
                {application.hotelName || "Not provided"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Submitted At
              </p>
              <p className="text-sm">
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default HotelManagerApplicationStatusCard;
