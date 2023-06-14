const mongoose = require('mongoose');
const { Schema } = mongoose;

const bannerSchema = new Schema({
  banner_text: { type: String, required: true },
  popup_photo: { type: String },
  popup_link: { type: String },
  isActive: { type: Boolean, default: true },
}, {
    versionKey: false, // Disable the version key
});

module.exports = mongoose.model('bannerP', bannerSchema);
