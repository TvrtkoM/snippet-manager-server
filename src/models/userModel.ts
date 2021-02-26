import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const User = model('user', userSchema);

export default User;

