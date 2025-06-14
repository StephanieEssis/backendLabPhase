const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{
     
    });
    console.log('✅ MongoDB Atlas connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    process.exit(1); 
  }
};

module.exports = connectDB;
