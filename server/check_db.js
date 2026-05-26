const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});
mongoose.connect(process.env.MONGODB_URI)
  .then(() => mongoose.connection.db.collection('applications').find({ 'uploadedFiles': { $exists: true, $ne: [] } }).sort({_id: -1}).limit(1).toArray())
  .then(docs => {
    console.log(JSON.stringify(docs[0].uploadedFiles, null, 2));
    mongoose.disconnect();
  });
