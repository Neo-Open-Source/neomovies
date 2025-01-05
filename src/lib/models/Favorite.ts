import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    required: true,
    enum: ['movie', 'tv']
  },
  title: {
    type: String,
    required: true
  },
  posterPath: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Составной индекс для уникальности комбинации userId, mediaId и mediaType
favoriteSchema.index({ userId: 1, mediaId: 1, mediaType: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
