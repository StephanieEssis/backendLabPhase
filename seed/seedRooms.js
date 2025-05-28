const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../models/Room');
const seedCategories = require('./seedCategories');

dotenv.config();

const createRooms = (categoryIds) => [
  // Chambres Suite Royal
  {
    name: 'Suite Royale Vue Mer',
    description: 'Notre suite la plus prestigieuse avec vue panoramique sur la mer',
    price: 500,
    category: categoryIds['Suite Royal'],
    capacity: 4,
    size: 80,
    floor: 7,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        alt: 'Suite Royale Vue Mer'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'vue-mer', 'balcon', 'jacuzzi', 'room-service'],
    status: 'disponible'
  },
  {
    name: 'Suite Royale Terrasse',
    description: 'Suite exceptionnelle avec grande terrasse privée et jacuzzi extérieur',
    price: 450,
    category: categoryIds['Suite Royal'],
    capacity: 3,
    size: 70,
    floor: 6,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
        alt: 'Suite Royale Terrasse'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'balcon', 'jacuzzi', 'room-service'],
    status: 'disponible'
  },

  // Chambres Deluxe
  {
    name: 'Chambre Deluxe Vue Mer',
    description: 'Spacieuse chambre avec une vue imprenable sur la mer',
    price: 300,
    category: categoryIds.Deluxe,
    capacity: 2,
    size: 35,
    floor: 4,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
        alt: 'Chambre Deluxe Vue Mer'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'vue-mer', 'balcon'],
    status: 'disponible'
  },
  {
    name: 'Chambre Deluxe Terrasse',
    description: 'Chambre élégante avec grande terrasse privée',
    price: 280,
    category: categoryIds.Deluxe,
    capacity: 2,
    size: 40,
    floor: 5,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop',
        alt: 'Chambre Deluxe Terrasse'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'balcon', 'room-service'],
    status: 'disponible'
  },

  // Suites
  {
    name: 'Suite Exécutive',
    description: 'Suite luxueuse avec salon séparé et vue panoramique',
    price: 350,
    category: categoryIds.Suite,
    capacity: 3,
    size: 55,
    floor: 6,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
        alt: 'Suite Exécutive'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'vue-mer', 'balcon', 'room-service'],
    status: 'disponible'
  },
  {
    name: 'Suite Business',
    description: 'Suite moderne avec espace de travail et services business',
    price: 320,
    category: categoryIds.Suite,
    capacity: 2,
    size: 50,
    floor: 5,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
        alt: 'Suite Business'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'room-service'],
    status: 'disponible'
  },

  // Chambres Familiales
  {
    name: 'Chambre Familiale Vue Mer',
    description: 'Grande chambre familiale avec vue sur la mer',
    price: 280,
    category: categoryIds.Familiale,
    capacity: 4,
    size: 45,
    floor: 3,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2070&auto=format&fit=crop',
        alt: 'Chambre Familiale Vue Mer'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'vue-mer'],
    status: 'disponible'
  },
  {
    name: 'Suite Familiale Deluxe',
    description: 'Grande suite familiale avec deux chambres séparées',
    price: 380,
    category: categoryIds.Familiale,
    capacity: 6,
    size: 75,
    floor: 4,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop',
        alt: 'Suite Familiale Deluxe'
      }
    ],
    amenities: ['wifi', 'tv', 'climatisation', 'minibar', 'coffre-fort', 'balcon', 'room-service'],
    status: 'disponible'
  }
];

const seedRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB établie');

    // Seed des catégories d'abord et récupération des IDs
    const categoryIds = await seedCategories();
    console.log('Catégories créées avec succès');

    // Supprimer les chambres existantes
    await Room.deleteMany({});
    console.log('Chambres existantes supprimées');

    // Créer les nouvelles chambres
    const rooms = createRooms(categoryIds);
    await Room.insertMany(rooms);
    console.log('Nouvelles chambres créées avec succès');

    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
  } catch (error) {
    console.error('Erreur lors du seed des chambres:', error);
    process.exit(1);
  }
};

// Si exécuté directement
if (require.main === module) {
  seedRooms()
    .then(() => {
      console.log('Seed des chambres terminé');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erreur:', error);
      process.exit(1);
    });
} 