
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertyOwnerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (owner)
    required: true,
  },
  properties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Property', // Reference to the Property model
    },
  ],
});

module.exports = mongoose.model('propertyOwner', propertyOwnerSchema);
