const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  {
    name: 'Standard',
    description: 'Chambre confortable et fonctionnelle pour un séjour agréable',
    basePrice: 100,
    features: [
      'Lit double',
      'Salle de bain privée',
      'TV écran plat',
      'Wifi gratuit',
      'Climatisation'
    ],
    image: {
      url: '/images/categories/standard.jpg',
      alt: 'Chambre standard'
    }
  },
  {
    name: 'Deluxe',
    description: 'Chambre spacieuse avec vue et prestations supérieures',
    basePrice: 200,
    features: [
      'Grand lit king-size',
      'Salle de bain luxueuse',
      'Salon privé',
      'Mini-bar',
      'Vue sur la ville',
      'Service en chambre 24/7'
    ],
    image: {
      url: '/images/categories/deluxe.jpg',
      alt: 'Chambre deluxe'
    }
  },
  {
    name: 'Suite',
    description: 'Suite exclusive avec espace séjour et prestations premium',
    basePrice: 350,
    features: [
      'Chambre séparée',
      'Grand salon',
      'Jacuzzi privé',
      'Vue panoramique',
      'Majordome personnel',
      'Petit-déjeuner inclus',
      'Accès au lounge VIP'
    ],
    image: {
      url: '/images/categories/suite.jpg',
      alt: 'Suite luxueuse'
    }
  }
];

const seedCategories = async () => {
  try {
    await connectDB();

    // Supprimer les catégories existantes
    await Category.deleteMany();
    console.log('Catégories supprimées');

    // Insérer les nouvelles catégories
    await Category.insertMany(categories);
    console.log('Catégories créées avec succès');

    process.exit();
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
};

seedCategories(); 