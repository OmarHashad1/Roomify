import { Badge } from "@/components/ui/badge";

function ContactUsHeader() {
  return (
    <div className="space-y-3">
      <Badge variant="secondary">We are here to help</Badge>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Contact Us
      </h1>
      <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
        Send us your inquiry, feedback, or support request and our team will
        get back to you as soon as possible.
      </p>
    </div>
  );
}

export default ContactUsHeader;
