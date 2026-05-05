import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./context/user/UserProvider";
import { HotelProvider } from "./context/hotel/HotelProvider";
import { HotelApplicationProvider } from "./context/hotelApplication/HotelApplicationProvider";
import { BookingProvider } from "./context/booking/BookingProvider";
import { RoomTypeProvider } from "./context/roomType/RoomTypeProvider";
import { RoomAvailabilityProvider } from "./context/roomAvailability/RoomAvailabilityProvider";
import { ReviewProvider } from "./context/review/ReviewProvider";
import { PaymentProvider } from "./context/payment/PaymentProvider";
import { LogProvider } from "./context/log/LogProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <HotelProvider>
        <HotelApplicationProvider>
          <RoomTypeProvider>
            <RoomAvailabilityProvider>
              <BookingProvider>
                <PaymentProvider>
                  <ReviewProvider>
                    <LogProvider>
                      <App />
                    </LogProvider>
                  </ReviewProvider>
                </PaymentProvider>
              </BookingProvider>
            </RoomAvailabilityProvider>
          </RoomTypeProvider>
        </HotelApplicationProvider>
      </HotelProvider>
    </UserProvider>
  </StrictMode>,
);
