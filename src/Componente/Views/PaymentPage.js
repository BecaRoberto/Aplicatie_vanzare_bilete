import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function PaymentPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extrageți parametrii din obiectul `location.search`
  const eventName = searchParams.get("eventName");
  const counter = parseInt(searchParams.get("counter"), 10);
  const price = parseFloat(searchParams.get("price"));
  const totalPayment = price * counter;
  const totalPaymentFormatted = `${totalPayment} RON`;

  // Starea locală pentru detaliile de plată introduse de utilizator
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  // Funcție pentru a obține data curentă în formatul așteptat de inputul `month`
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    return `${year}-${month}`;
  };

  // Funcție pentru a formata numărul cardului în grupuri de 4 cifre
  const formatCardNumber = (value) => {
    const trimmedValue = value.replace(/\s/g, "");
    const parts = [];
    for (let i = 0; i < trimmedValue.length; i += 4) {
      parts.push(trimmedValue.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  // Funcție pentru a gestiona evenimentul de plată
  const handlePayment = async (e) => {
    e.preventDefault();

    // Generați un cod de bilete aleatoriu
    const ticketCode = Math.floor(Math.random() * 1000000);

    // Detaliile plății care vor fi trimise la backend
    const paymentDetails = {
      eventName,
      totalPayment,
      cardNumber,
      cardHolder,
      expirationDate,
      cvv,
      recipientEmail, // Includem recipientEmail în detaliile de plată
    };

    try {
      // Trimiteți detaliile plății și trimiteți un email de confirmare
      const response = await axios.post(
        "http://localhost:1433/api/send-email", 
        {
          recipientEmail: paymentDetails.recipientEmail,
          senderEmail: "becarobi@gmail.com",
          subject: "Ticket Confirmation",
          message: `Dear Customer,\n\nYour order has been placed successfully! Your ticket code is ${ticketCode}.\n\nThank you for your purchase!`,
          sendGridApiKey: "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",
        }
      );

      console.log("Email sent successfully:", response.data);
      alert(`Your order has been placed successfully! Your ticket code: ${ticketCode}`);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while processing your order. Please try again later.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-lg rounded p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">My Order</h1>
      <div className="mb-6">
        <p className="font-bold text-center">Event Name:</p>
        <p className="text-center">{eventName}</p>
      </div>
      <div className="mb-6">
        <p className="font-bold text-center">Number of Tickets:</p>
        <p className="text-center">{counter}</p>
      </div>
      <div className="mb-6">
        <p className="font-bold text-center">Total Payment:</p>
        <p className="text-center">{totalPaymentFormatted}</p>
      </div>
      <form onSubmit={handlePayment} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Payment Information</h2>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Card Number</label>
          <input
            type="text"
            value={formatCardNumber(cardNumber)}
            onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ""))}
            required
            pattern="\d{4} \d{4} \d{4} \d{4}"
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Card Holder</label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.replace(/[^a-zA-Z ]/g, ""))}
            required
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Expiration Date</label>
          <input
            type="month"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            min={getCurrentDate()}
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">CVV (3 digits)</label>
          <input
            type="text"
            pattern="\d{3}"
            title="Please enter a 3-digit CVV number"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            required
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold">Email</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none"
        >
          Complete the order
        </button>
      </form>
    </div>
  );
}

export default PaymentPage;
