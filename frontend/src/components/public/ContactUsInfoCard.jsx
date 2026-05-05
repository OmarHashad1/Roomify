import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    title: "Support Email",
    value: "support@roomify.com",
    href: "mailto:support@roomify.com",
  },
  {
    icon: Phone,
    title: "Phone Number",
    value: "+20 100 123 4567",
    href: "tel:+201001234567",
  },
  {
    icon: MapPin,
    title: "Office Location",
    value: "Nasr City, Cairo, Egypt",
  },
];

function ContactUsInfoCard() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {CONTACT_ITEMS.map(({ icon, title, value, href }) => {
          const ItemIcon = icon;
          return (
          <div key={title} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <ItemIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{title}</p>
              {href ? (
                <a
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">{value}</p>
              )}
            </div>
          </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default ContactUsInfoCard;
