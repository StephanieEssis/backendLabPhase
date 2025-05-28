const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  {
    name: 'Suite Royal',
    description: 'Chambre confortable avec les équipements essentiels',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Deluxe',
    description: 'Chambre spacieuse avec vue et équipements premium',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Suite',
    description: 'Suite luxueuse avec salon séparé et services exclusifs',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Familiale',
    description: 'Grande chambre adaptée aux familles avec espace de vie',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2070&auto=format&fit=crop'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connexion à MongoDB établie');

    // Supprimer les catégories existantes
    await Category.deleteMany({});
    console.log('Catégories existantes supprimées');

    // Insérer les nouvelles catégories
    const createdCategories = await Category.insertMany(categories);
    console.log('Nouvelles catégories créées');

    // Retourner les IDs pour les utiliser dans le seed des chambres
    const categoryIds = createdCategories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    return categoryIds;
  } catch (error) {
    console.error('Erreur lors du seed des catégories:', error);
    process.exit(1);
  }
};

module.exports = seedCategories;

// Si exécuté directement
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('Seed des catégories terminé');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erreur:', error);
      process.exit(1);
    });
} 