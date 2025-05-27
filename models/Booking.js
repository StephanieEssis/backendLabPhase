const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'utilisateur est requis"]
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'La chambre est requise']
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise'],
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'La date de début doit être dans le futur'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise'],
    validate: {
      validator: function(v) {
        return v > this.startDate;
      },
      message: 'La date de fin doit être après la date de début'
    }
  },
  guests: {
    type: Number,
    required: [true, 'Le nombre de personnes est requis'],
    min: [1, 'Au moins une personne est requise']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['en attente', 'confirmée', 'annulée', 'terminée'],
    default: 'en attente'
  },
  paymentStatus: {
    type: String,
    enum: ['en attente', 'payé', 'remboursé'],
    default: 'en attente'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '12:00'
  }
}, {
  timestamps: true
});

// Middleware pour vérifier la disponibilité avant la sauvegarde
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('endDate')) {
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.room);
    
    if (!room) {
      next(new Error('Chambre non trouvée'));
      return;
    }

    const isAvailable = await room.isAvailable(this.startDate, this.endDate);
    if (!isAvailable && this.status !== 'annulée') {
      next(new Error('La chambre n\'est pas disponible pour ces dates'));
      return;
    }
  }
  next();
});

// Méthode pour calculer la durée du séjour en jours
bookingSchema.methods.getDuration = function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
};

// Méthode pour calculer le prix total
bookingSchema.methods.calculateTotalPrice = async function() {
  const Room = mongoose.model('Room');
  const room = await Room.findById(this.room);
  
  if (!room) {
    throw new Error('Chambre non trouvée');
  }

  const duration = this.getDuration();
  this.totalPrice = room.price * duration;
  return this.totalPrice;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 