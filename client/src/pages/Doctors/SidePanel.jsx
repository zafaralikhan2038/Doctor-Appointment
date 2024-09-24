// import { toast } from "react-toastify";
// import { BASE_URL, token } from "../../config";
// import { convertTime } from "../../utils/convertTime";

// /* eslint-disable react/prop-types */
// const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
//   const bookingHandler = async () => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/bookings/checkout-session/${doctorId}`,
//         {
//           method: "post",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(),
//         }
//       );

//       const data = res.json({});

//       if (!res.ok) {
//         throw new Error(data.message + " Please try again");
//       }

//       if (data.session.url) {
//         window.location.href = data.session.url;
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
//       <div className="flex items-center justify-between">
//         <p className="text__para mt-0 font-semibold">Ticket Price</p>
//         <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
//           {ticketPrice} INR
//         </span>
//       </div>
//       <div className="mt-[30px]">
//         <p className="text__para mt-0 font-semibold text-headingColor">
//           Available Time Slots:
//         </p>

//         <ul className="mt-3">
//           {timeSlots?.map((item, index) => (
//             <li key={index} className="flex items-center justify-between mb-2">
//               <p className="text-[15px] leading-6 text-textColor font-semibold">
//                 {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
//               </p>
//               <p className="text-[15px] leading-6 text-textColor font-semibold">
//                 {convertTime(item.startingTime)} -{" "}
//                 {convertTime(item.endingTime)}
//               </p>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <button onClick={bookingHandler} className="btn px-2 w-full rounded-md">
//         Book Appointment
//       </button>
//     </div>
//   );
// };

// export default SidePanel;


import { toast } from "react-toastify";
import { BASE_URL, token } from "../../config";
import { convertTime } from "../../utils/convertTime";

/* eslint-disable react/prop-types */
const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const bookingHandler = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "POST", // Make sure it's POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Removed empty JSON body if not required by API
        }
      );

      // Await the JSON response
      const data = await res.json();

      // Handle non-200 response codes
      if (!res.ok) {
        throw new Error(data.message + " Please try again");
      }

      // Redirect to the session URL if it's available
      if (data.session && data.session.url) {
        window.location.href = data.session.url;
      } else {
        throw new Error("Session URL not available");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} INR
        </span>
      </div>
      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Available Time Slots:
        </p>

        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={bookingHandler} className="btn px-2 w-full rounded-md">
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;

