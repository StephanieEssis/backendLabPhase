const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const router = express.Router();

// Route pour obtenir les statistiques des chambres
router.get('/rooms', async (req, res) => {
  try {
    // Récupérer les chambres les plus réservées
    const mostBooked = await Booking.aggregate([
      {
        $group: {
          _id: '$room',
          bookingCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomDetails'
        }
      },
      {
        $unwind: '$roomDetails'
      },
      {
        $project: {
          _id: 1,
          name: '$roomDetails.name',
          bookingCount: 1
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Récupérer les réservations par mois
    const bookingsByMonth = await Booking.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$startDate' },
            year: { $year: '$startDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);

    res.json({
      mostBooked,
      bookingsByMonth
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router; 