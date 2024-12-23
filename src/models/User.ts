import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password?: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
  verificationToken?: string;
  isAdmin?: boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: String,
  emailVerified: Date,
  verificationToken: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

// Не включаем пароль в запросы по умолчанию
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

// Хэшируем пароль перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const User = models.User || model('User', userSchema);
export default User;
