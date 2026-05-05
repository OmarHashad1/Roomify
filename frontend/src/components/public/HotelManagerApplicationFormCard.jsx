import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { hotelManagerApplicationSchema } from "@/Schemas/Public/hotelManagerApplication.validation";

const INPUT_CLASS =
  "w-full rounded-input border border-border bg-background py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring";

const AMENITIES = [
  "Free WiFi",
  "Parking",
  "Swimming Pool",
  "Gym",
  "Restaurant",
  "Airport Shuttle",
];

function HotelManagerApplicationFormCard({ onSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      hotelName: "",
      hotelDescription: "",
      address: "",
      totalRooms: "",
      amenities: [],
      documents: [],
    },
    validationSchema: hotelManagerApplicationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 900));

      const application = {
        ...values,
        status: "under_review",
        documents: values.documents.map((file) => file.name),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("hotelManagerApplication", JSON.stringify(application));
      onSubmitted?.(application);
      setIsSubmitting(false);
      resetForm();
      toast.success("Application submitted successfully.", {
        description: "Your request is now under admin review.",
      });
    },
  });

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Apply as Hotel Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${INPUT_CLASS} px-3`}
                placeholder="Your full name"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-xs text-destructive">{formik.errors.fullName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${INPUT_CLASS} px-3`}
                placeholder="you@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-destructive">{formik.errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${INPUT_CLASS} px-3`}
              placeholder="+20 100 123 4567"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-xs text-destructive">{formik.errors.phone}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="hotelName" className="text-sm font-medium">
                Hotel Name
              </label>
              <input
                id="hotelName"
                name="hotelName"
                type="text"
                value={formik.values.hotelName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${INPUT_CLASS} px-3`}
                placeholder="Hotel name"
              />
              {formik.touched.hotelName && formik.errors.hotelName && (
                <p className="text-xs text-destructive">{formik.errors.hotelName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="totalRooms" className="text-sm font-medium">
                Number of Rooms
              </label>
              <input
                id="totalRooms"
                name="totalRooms"
                type="number"
                min="1"
                value={formik.values.totalRooms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${INPUT_CLASS} px-3`}
                placeholder="50"
              />
              {formik.touched.totalRooms && formik.errors.totalRooms && (
                <p className="text-xs text-destructive">{formik.errors.totalRooms}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="hotelDescription" className="text-sm font-medium">
              Hotel Description
            </label>
            <textarea
              id="hotelDescription"
              name="hotelDescription"
              rows={5}
              value={formik.values.hotelDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${INPUT_CLASS} px-3 py-2 resize-y min-h-32`}
              placeholder="Describe your hotel and what makes it unique."
            />
            {formik.touched.hotelDescription && formik.errors.hotelDescription && (
              <p className="text-xs text-destructive">
                {formik.errors.hotelDescription}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="address" className="text-sm font-medium">
              Hotel Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`${INPUT_CLASS} px-3`}
              placeholder="Street, City, Country"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-xs text-destructive">{formik.errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Amenities</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {AMENITIES.map((amenity) => (
                <label
                  key={amenity}
                  className="flex items-center gap-2 text-sm rounded-lg border border-border px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        formik.setFieldValue("amenities", [
                          ...formik.values.amenities,
                          amenity,
                        ]);
                      } else {
                        formik.setFieldValue(
                          "amenities",
                          formik.values.amenities.filter((item) => item !== amenity)
                        );
                      }
                    }}
                    className="accent-(--color-primary)"
                  />
                  {amenity}
                </label>
              ))}
            </div>
            {formik.touched.amenities && formik.errors.amenities && (
              <p className="text-xs text-destructive">{formik.errors.amenities}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="documents" className="text-sm font-medium">
              Verification Documents
            </label>
            <input
              id="documents"
              name="documents"
              type="file"
              multiple
              onBlur={formik.handleBlur}
              onChange={(e) =>
                formik.setFieldValue("documents", Array.from(e.target.files ?? []))
              }
              className={`${INPUT_CLASS} px-3 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium`}
            />
            <p className="text-xs text-muted-foreground">
              Upload hotel license, ownership proof, or legal documents.
            </p>
            {formik.touched.documents && formik.errors.documents && (
              <p className="text-xs text-destructive">{formik.errors.documents}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
          >
            {isSubmitting && <Spinner className="size-4" data-icon="inline-start" />}
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default HotelManagerApplicationFormCard;
