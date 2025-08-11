import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FaCalendarAlt, FaClock, FaUsers, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample venue data (in real app, fetch from API based on id)
  const venue = {
    id: id || 1,
    name: "Sunrise Tennis Club",
    sport: "Tennis",
    location: "Downtown Sports Complex",
    address: "123 Sports Avenue, New York, NY 10001",
    price: 500,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=400&fit=crop",
    description: "Professional tennis courts with excellent lighting and facilities. Perfect for both casual players and serious competitors.",
    amenities: ["Professional Courts", "Lighting", "Equipment Rental", "Parking", "Shower Facilities"],
    availableCourts: ["Court 1", "Court 2", "Court 3", "Court 4"]
  };

  // State
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [selectedCourts, setSelectedCourts] = useState([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed values
  const totalPrice = useMemo(() => {
    const courtsCount = Math.max(1, selectedCourts.length);
    return duration * venue.price * courtsCount;
  }, [duration, selectedCourts.length, venue.price]);

  const toggleCourtSelection = (courtName) => {
    setSelectedCourts(prev =>
      prev.includes(courtName)
        ? prev.filter(c => c !== courtName)
        : [...prev, courtName]
    );
  };

  const handleBooking = async () => {
    if (!startDate || !startTime || selectedCourts.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingStep(3); // Show success
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Venue Information */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-2">{venue.name}</h2>
              <p className="text-neutral-600 mb-4">{venue.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-warning-600">
                  <FaCheckCircle className="mr-1" />
                  <span className="font-semibold">{venue.rating}</span>
                  <span className="text-neutral-500 ml-1">({venue.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-primary">
                  <FaCalendarAlt className="mr-1" />
                  <span>{venue.sport}</span>
                </div>
              </div>
              <div className="flex items-center text-neutral-600">
                <FaCheckCircle className="mr-2" />
                <span>{venue.location}</span>
              </div>
            </div>
            <div>
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selection */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-primary" />
                Select Date
              </h3>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Choose a date"
                className="form-input"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaClock className="mr-2 text-primary" />
                Select Time
              </h3>
              <DatePicker
                selected={startTime}
                onChange={(time) => setStartTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select time"
                className="form-input"
              />
            </div>
          </div>

          {/* Duration Selection */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaClock className="mr-2 text-primary" />
                Duration (hours)
              </h3>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDuration(d => Math.max(1, d - 1))}
                  className="w-12 h-12 bg-error-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 font-bold text-xl"
                >
                  –
                </button>
                <span className="text-2xl font-bold text-neutral-900 min-w-[3rem] text-center">{duration}</span>
                <button
                  type="button"
                  onClick={() => setDuration(d => d + 1)}
                  className="w-12 h-12 bg-success-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Court Selection */}
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaUsers className="mr-2 text-primary" />
                Select Courts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {venue.availableCourts.map((court) => (
                  <button
                    key={court}
                    type="button"
                    onClick={() => toggleCourtSelection(court)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 transform active:scale-95 font-semibold ${
                      selectedCourts.includes(court)
                        ? "bg-primary-500 text-white border-primary-500 shadow-md"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-primary-300 hover:shadow-md"
                    }`}
                  >
                    {court}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold flex items-center">
                  <FaCreditCard className="mr-2" />
                  Booking Summary
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Venue</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sport</span>
                    <span className="font-medium">{venue.sport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Date</span>
                    <span className="font-medium">
                      {startDate ? startDate.toLocaleDateString() : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Time</span>
                    <span className="font-medium">
                      {startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Duration</span>
                    <span className="font-medium">{duration} hour{duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Courts</span>
                    <span className="font-medium">{Math.max(1, selectedCourts.length)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-success-600">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingStep(2)}
                  disabled={!startDate || !startTime || selectedCourts.length === 0}
                  className="btn btn-primary btn-lg w-full"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="card-header">
          <h2 className="text-2xl font-bold">Payment Information</h2>
        </div>
        <div className="card-body space-y-6">
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="MM/YY"
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="text"
                className="form-input"
                placeholder="123"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cardholder Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-success-600">₹{totalPrice}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setBookingStep(1)}
              className="btn btn-outline flex-1"
            >
              Back
            </button>
            <button
              onClick={handleBooking}
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="loading"></div>
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="card">
        <div className="card-body">
          <div className="w-16 h-16 bg-success-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="text-neutral-600 mb-6">
            Your booking has been successfully confirmed. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-lg text-left">
              <h3 className="font-bold mb-2">Booking Details</h3>
              <p><strong>Venue:</strong> {venue.name}</p>
              <p><strong>Date:</strong> {startDate?.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Duration:</strong> {duration} hour{duration !== 1 ? 's' : ''}</p>
              <p><strong>Total:</strong> ₹{totalPrice}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/venues')}
                className="btn btn-outline flex-1"
              >
                Browse More Venues
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="btn btn-primary flex-1"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Your Session
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Secure your preferred time slot and get ready to play
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          {/* Progress Steps */}
          {bookingStep < 3 && (
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  bookingStep >= 1 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-4 ${bookingStep >= 2 ? 'bg-primary-500' : 'bg-neutral-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  bookingStep >= 2 ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  2
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <span className="text-sm text-neutral-600">Booking Details</span>
                <span className="text-sm text-neutral-600 mx-8">Payment</span>
              </div>
            </div>
          )}

          {/* Step Content */}
          {bookingStep === 1 && renderStep1()}
          {bookingStep === 2 && renderStep2()}
          {bookingStep === 3 && renderStep3()}
        </div>
      </section>
    </div>
  );
};

export default Booking; 