// import { Booking } from "../models/booking.model.js";
// import { Doctor } from "../models/doctor.model.js";
// import { User } from "../models/user.model.js";
// import Stripe from "stripe";

// const getCheckoutSession = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.doctorId);
//     const user = await User.findById(req.userId);

//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     // create stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_SIDE_URL}/checkout-success`,
//       cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
//       customer_email: user.email,
//       client_reference_id: req.params.doctorId,
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             unit_amount: doctor.ticketPrice * 100,
//             product_data: {
//               name: doctor.name,
//               description: doctor.bio,
//               images: [doctor.photo],
//             },
//           },
//           quantity: 1,
//         },
//       ],
//     });

//     // create a new booking
//     const booking = new Booking({
//       doctor: doctor._id,
//       user: user._id,
//       ticketPrice: doctor.ticketPrice,
//       session: session.id,
//     });

//     await booking.save();

//     return resizeBy
//       .status(200)
//       .json({ success: true, message: "Payment successfully done", session });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error while creating checkout session",
//     });
//   }
// };

// export { getCheckoutSession };

// import { Booking } from "../models/booking.model.js";
// import { Doctor } from "../models/doctor.model.js";
// import { User } from "../models/user.model.js";
// import axios from "axios"; // For making API requests to the PhonePe API
// import crypto from "crypto"; // For generating secure hash for the request

// const getCheckoutSession = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.doctorId);
//     const user = await User.findById(req.userId);

//     const merchantId = process.env.PHONEPE_MERCHANT_ID;
//     const secretKey = process.env.PHONEPE_SECRET_KEY;
//     const baseUrl = process.env.PHONEPE_BASE_URL; // PhonePe API base URL (sandbox or production)

//     const transactionId = `TXN_${Date.now()}`; // Unique transaction ID
//     const successUrl = `${process.env.CLIENT_SIDE_URL}/checkout-success`;
//     const cancelUrl = `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`;

//     // Create the request payload for PhonePe
//     const body = {
//       merchantId,
//       transactionId,
//       amount: doctor.ticketPrice * 100, // Amount in paise (₹1 = 100 paise)
//       merchantUserId: user._id.toString(),
//       redirectUrl: successUrl,
//       callbackUrl: cancelUrl,
//       product: {
//         name: doctor.name,
//         description: doctor.bio,
//         imageUrl: doctor.photo,
//       },
//     };

//     // Generate the signature using SHA256 for request integrity
//     const payload = `${baseUrl}/pg/v1/pay${JSON.stringify(body)}${secretKey}`;
//     const signature = crypto.createHash("sha256").update(payload).digest("hex");

//     // Make the payment request to PhonePe
//     const paymentResponse = await axios.post(`${baseUrl}/pg/v1/pay`, body, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-VERIFY": `${signature}###${merchantId}`,
//       },
//     });

//     if (paymentResponse.data.success) {
//       // Create a new booking upon successful payment request initiation
//       const booking = new Booking({
//         doctor: doctor._id,
//         user: user._id,
//         ticketPrice: doctor.ticketPrice,
//         session: transactionId,
//       });

//       await booking.save();

//       // Send response back to the client with the payment URL (UPI/PhonePe URL)
//       return res.status(200).json({
//         success: true,
//         message: "Payment initiated successfully",
//         paymentUrl: paymentResponse.data.paymentUrl, // The URL where the user will be redirected for payment
//       });
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: "Error initiating payment",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error while creating checkout session",
//     });
//   }
// };

// export { getCheckoutSession };


import { Booking } from "../models/booking.model.js";
import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/user.model.js";
import axios from "axios"; // For making API requests to the PhonePe API
import crypto from "crypto"; // For generating secure hash for the request

const getCheckoutSession = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const secretKey = process.env.PHONEPE_SECRET_KEY;
    const baseUrl = process.env.PHONEPE_BASE_URL; // PhonePe API base URL (sandbox or production)

    const transactionId = `TXN_${Date.now()}`; // Unique transaction ID
    const successUrl = `${process.env.CLIENT_SIDE_URL}/checkout-success`;
    const cancelUrl = `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`;

    // Create the request payload for PhonePe
    const body = {
      merchantId,
      transactionId,
      amount: doctor.ticketPrice * 100, // Amount in paise (₹1 = 100 paise)
      merchantUserId: user._id.toString(),
      redirectUrl: successUrl,
      callbackUrl: cancelUrl,
      product: {
        name: doctor.name,
        description: doctor.bio,
        imageUrl: doctor.photo,
      },
    };

    // Generate the signature using SHA256 for request integrity
    const payload = `${baseUrl}/pg/v1/pay${JSON.stringify(body)}${secretKey}`;
    const signature = crypto.createHash("sha256").update(payload).digest("hex");

    // Make the payment request to PhonePe
    const paymentResponse = await axios.post(`${baseUrl}/pg/v1/pay`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": `${signature}###${merchantId}`,
      },
    });

    // Check if the request was successful
    if (paymentResponse.data.success) {
      // Create a new booking upon successful payment request initiation
      const booking = new Booking({
        doctor: doctor._id,
        user: user._id,
        ticketPrice: doctor.ticketPrice,
        session: transactionId,
      });

      await booking.save();

      // Send response back to the client with the payment URL
      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        paymentUrl: paymentResponse.data.paymentUrl, // The URL where the user will be redirected for payment
      });
    } else {
      // Log PhonePe response for better debugging
      console.error('PhonePe Payment Response Error:', paymentResponse.data);

      return res.status(500).json({
        success: false,
        message: paymentResponse.data.message || "Error initiating payment",
      });
    }
  } catch (error) {
    // Log error for better understanding of the issue
    console.error('Checkout Session Error:', error);

    return res.status(500).json({
      success: false,
      message: "Error while creating checkout session",
    });
  }
};

export { getCheckoutSession };
