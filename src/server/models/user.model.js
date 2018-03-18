import mongoose from 'mongoose';
import { generateToken } from '../utils';
import { conversionOptions } from './utils';

const userSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  name: {
    type: String,
    required: 'User name is required'
  },
  token: {
    type: String,
    required: 'Token is required'
  },
  settings: {
    columnsVisible: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column'
    }]
  }
});

userSchema.pre('validate', async function preValidate(next) {
  if (!this.token) {
    this.token = await generateToken(48);
  }
  next();
});

userSchema.set('toJSON', conversionOptions);
userSchema.set('toObject', conversionOptions);

export default mongoose.model('User', userSchema);
