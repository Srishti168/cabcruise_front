import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState("");
  const [startTime, setStartTime] = useState("");
  const [selectedCabPrice, setSelectedCabPrice] = useState(null); // Initialize selectedCabPrice state
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [bookedCabs, setBookedCabs] = useState([]);
  const [error,seterror]=useState("");

  useEffect(() => {
    axios
      .get("https://cabcruise.onrender.com/cabs")
      .then((response) => {
        setCabs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cabs:", error);
      });
  }, []);

  const handleBooking = () => {
    if (source === destination) {
      alert("Source and destination cannot be the same");
      return;
    }

    if (!selectedCab) {
      alert("Please select a cab");
      return;
    }

    if (!startTime) {
      alert("Please select a start time");
      return;
    }

    const isCabBooked = bookedCabs.some(
      (cab) => cab.cabId === selectedCab && cab.startTime === startTime
    );
    if (isCabBooked) {
      setBookingConfirmation("");
      alert("This cab is already booked at the specified start time");
      return;
    }

    axios
      .post("https://cabcruise.onrender.com/book", {
        userEmail: "user@example.com",
        source,
        destination,
        cabId: selectedCab,
        startTime,
      })
      .then((response) => {
        setBookingConfirmation(response.data);
        setBookedCabs([...bookedCabs, { cabId: selectedCab, startTime }]);
      })
      .catch((error) => {
        alert("Error booking cab:", error.message);
      });
  };

  const handleCabSelection = (cabId) => {
    setSelectedCab(cabId);
    const selectedCabPrice = cabs.find((cab) => cab._id === cabId).pricePerMinute;
    setSelectedCabPrice(selectedCabPrice);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f7f7f7", borderRadius: "5px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Cab Booking System</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form style={{ marginBottom: "20px" }}>
        <label htmlFor="source">Source:</label>
        <select
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        >
          <option value="">Select</option>
          {["A", "B", "C", "D", "E", "F"].map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="destination">Destination:</label>
        <select
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        >
          <option value="">Select</option>
          {["A", "B", "C", "D", "E", "F"].map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="cab">Select a Cab:</label>
        <select
          id="cab"
          onChange={(e) => handleCabSelection(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        >
          <option value="">Select</option>
          {cabs.map((cab) => (
            <option key={cab._id} value={cab._id}>
              {cab.name} - Price Per Minute: ${cab.pricePerMinute}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="startTime" style={{ marginTop: "10px" }}>Start Time:</label>
        <input
          type="time"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
        <br />

        <button type="button" onClick={handleBooking} style={{ marginTop: "10px" }}>
          Book Cab
        </button>
      </form>

      {bookingConfirmation && (
        <div>
          <h2>Booking Confirmation</h2>
          <p>Source: {bookingConfirmation.source}</p>
          <p>Destination: {bookingConfirmation.destination}</p>
          <p>
            Cab:{" "}
            {cabs.find((cab) => cab._id === selectedCab).name} - Price Per
            Minute: ${selectedCabPrice}
          </p>
          <p>Start Time: {bookingConfirmation.startTime}</p>
          <p>Estimated Arrival Time: {bookingConfirmation.estimatedArrivalTime}</p>
          <p>Total Time: {bookingConfirmation.totalTime} minutes</p>
          <p>Estimated Cost: {bookingConfirmation.estimatedCost ? `$${bookingConfirmation.estimatedCost.toFixed(2)}` : 'N/A'}</p>
        </div>
      )}
    </div>
  );
}

export default App;