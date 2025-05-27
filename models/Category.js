const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  basePrice: {
    type: Number,
    required: [true, 'Le prix de base est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  features: [{
    type: String,
    required: true
  }],
  image: {
    url: {
      type: String,
      required: [true, "L'image est requise"]
    },
    alt: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual pour obtenir toutes les chambres de cette catégorie
categorySchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'category'
});

// Méthode pour obtenir le nombre de chambres disponibles dans cette catégorie
categorySchema.methods.getAvailableRoomsCount = async function() {
  const Room = mongoose.model('Room');
  return await Room.countDocuments({
    category: this._id,
    status: 'disponible'
  });
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
