import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la chambre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La catégorie est requise']
  },
  capacity: {
    type: Number,
    required: [true, 'La capacité est requise'],
    min: [1, 'La capacité minimum est de 1 personne']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  amenities: [{
    type: String,
    enum: [
      'wifi',
      'tv',
      'climatisation',
      'minibar',
      'coffre-fort',
      'room-service',
      'vue-mer',
      'balcon',
      'jacuzzi'
    ]
  }],
  status: {
    type: String,
    enum: ['disponible', 'occupée', 'maintenance'],
    default: 'disponible'
  },
  size: {
    type: Number,
    required: [true, 'La taille de la chambre est requise'],
    min: [0, 'La taille ne peut pas être négative']
  },
  floor: {
    type: Number,
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour les réservations
roomSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'room'
});

// Méthode pour vérifier la disponibilité
roomSchema.methods.isAvailable = async function(startDate, endDate) {
  const Booking = mongoose.model('Booking');
  const conflictingBookings = await Booking.find({
    room: this._id,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ],
    status: { $ne: 'annulée' }
  });
  
  return conflictingBookings.length === 0;
};

// Middleware pour mettre à jour la note moyenne
roomSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
  }
  next();
});

const Room = mongoose.model('Room', roomSchema);

export default Room; 