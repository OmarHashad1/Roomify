import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const INPUT_CLASS =
  "w-full rounded-input border border-border bg-background py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring";

function ContactUsFormCard() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Send a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            setIsSubmitting(true);
            await new Promise((resolve) => setTimeout(resolve, 900));
            setIsSubmitting(false);
            form.reset();
            toast.success("Your message was sent successfully.");
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your full name"
                className={`${INPUT_CLASS} px-3`}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className={`${INPUT_CLASS} px-3`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              placeholder="How can we help?"
              className={`${INPUT_CLASS} px-3`}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              placeholder="Write your message here..."
              className={`${INPUT_CLASS} px-3 py-2 resize-y min-h-36`}
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
          >
            {isSubmitting && <Spinner className="size-4" data-icon="inline-start" />}
            {isSubmitting ? "Sending..." : "Submit Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ContactUsFormCard;
