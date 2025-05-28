const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema); 