// models/Booking.js
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  // Booking Information
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  paidAt: {
    type: Date,
    required: true,
  },
  
  // Passenger Information
  passenger: {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    passportNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
  },
  
  // Flight Information - Enhanced
  flight: {
    flightNumber: {
      type: String,
      required: true,
    },
    airline: {
      name: String,
      iata: String,
      code: String,
    },
    departureAirport: {
      iata: String,
      airport: String,
      city: String,
      country: String,
    },
    arrivalAirport: {
      iata: String,
      airport: String,
      city: String,
      country: String,
    },
    departureTime: String,
    departureTimeRaw: Date,
    arrivalTime: String,
    arrivalTimeRaw: Date,
    departureDate: String,
    departureDateRaw: Date,
    duration: String,
    durationMinutes: Number,
    terminal: String,
    gate: String,
    stops: {
      type: Number,
      default: 0,
    },
    cabinClass: {
      type: String,
      default: 'Economy',
    },
    flightType: {
      type: String,
      enum: ['one_way', 'round_trip'],
      default: 'one_way',
    },
  },
  
  // Return Flight Information (for round trips)
  returnFlight: {
    flightNumber: String,
    airline: {
      name: String,
      iata: String,
    },
    departureAirport: {
      iata: String,
      airport: String,
    },
    arrivalAirport: {
      iata: String,
      airport: String,
    },
    departureTime: String,
    departureTimeRaw: Date,
    arrivalTime: String,
    arrivalTimeRaw: Date,
    departureDate: String,
    departureDateRaw: Date,
    duration: String,
    durationMinutes: Number,
    terminal: String,
    gate: String,
    stops: Number,
  },
  
  // Raw flight data (for complete reference)
  flightData: {
    type: mongoose.Schema.Types.Mixed,
  },
  
  // Timestamps
  bookingDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
  // Email sent status
  emailSent: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Create indexes for faster searches
BookingSchema.index({ 'passenger.email': 1, bookingReference: 1 });
BookingSchema.index({ 'passenger.fullName': 1 });
BookingSchema.index({ 'flight.flightNumber': 1, 'passenger.email': 1 });
BookingSchema.index({ 'flight.departureDateRaw': 1 });
BookingSchema.index({ createdAt: -1 });

// Virtual for formatted date
BookingSchema.virtual('formattedBookingDate').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString() : 'N/A';
});

// Method to get flight summary
BookingSchema.methods.getFlightSummary = function() {
  return `${this.flight.airline.name} ${this.flight.flightNumber} from ${this.flight.departureAirport.iata} to ${this.flight.arrivalAirport.iata} on ${this.flight.departureDate}`;
};

// Static method to find bookings by email
BookingSchema.statics.findByEmail = function(email) {
  return this.find({ 'passenger.email': email }).sort({ createdAt: -1 });
};

// Static method to find bookings by date range
BookingSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    'flight.departureDateRaw': {
      $gte: startDate,
      $lte: endDate
    }
  });
};

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);