import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// Créer une nouvelle réservation
export const createBooking = async (req, res) => {
  try {
    const room = await Room.findById(req.body.room);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chambre non trouvée'
      });
    }

    // Vérifier la disponibilité
    const isAvailable = await room.isAvailable(
      new Date(req.body.startDate),
      new Date(req.body.endDate)
    );

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'La chambre n\'est pas disponible pour ces dates'
      });
    }

    // Créer la réservation
    const booking = new Booking({
      ...req.body,
      user: req.user.id
    });

    // Calculer le prix total
    await booking.calculateTotalPrice();
    await booking.save();

    // Mettre à jour le statut de la chambre
    room.status = 'occupée';
    await room.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir toutes les réservations (admin)
export const getAllBookings = async (req, res) => {
  try {
    const {
      status,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .sort(sort)
      .populate('user', 'firstName lastName email')
      .populate('room', 'name category price');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les réservations de l'utilisateur connecté
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('room', 'name category price images');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir une réservation spécifique
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('room', 'name category price images');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur a le droit de voir cette réservation
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Mettre à jour une réservation
export const updateBooking = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['startDate', 'endDate', 'guests', 'specialRequests'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Mises à jour non valides'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur a le droit de modifier cette réservation
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    // Si les dates sont modifiées, vérifier la disponibilité
    if (updates.includes('startDate') || updates.includes('endDate')) {
      const room = await Room.findById(booking.room);
      const isAvailable = await room.isAvailable(
        new Date(req.body.startDate || booking.startDate),
        new Date(req.body.endDate || booking.endDate)
      );

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'La chambre n\'est pas disponible pour ces dates'
        });
      }
    }

    updates.forEach(update => booking[update] = req.body[update]);
    await booking.calculateTotalPrice();
    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Annuler une réservation
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur a le droit d'annuler cette réservation
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé'
      });
    }

    booking.status = 'annulée';
    await booking.save();

    // Mettre à jour le statut de la chambre
    const room = await Room.findById(booking.room);
    room.status = 'disponible';
    await room.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 