import mongoose from 'mongoose';

export interface Movie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  year: number;
  rating: number;
  isVisible?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  posterUrl: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, required: true },
  isVisible: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema);
