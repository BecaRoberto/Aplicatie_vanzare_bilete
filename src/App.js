import React from "react";
import Header from "./Componente/Header";
import Footer from "./Componente/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Componente/Views/Home";
import RegisterLogin from "./Componente/Views/Reigster&Login";
import Template from "./Componente/Views/Template";
import PaymentPage from "./Componente/Views/PaymentPage";
import { EventProvider } from "./Componente/Views/EventContext";

function App() {
  return (
    <div className="relative pb-10 min-h-screen">
      <Router>
        <Header />

        <div className="p-3">
          <Routes>
            <Route path="/" element={<EventProvider><Home /></EventProvider>} />
            <Route path="/Register&Login" element={<RegisterLogin />} />
            <Route path="/Template" element={<EventProvider><Template /></EventProvider>} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
