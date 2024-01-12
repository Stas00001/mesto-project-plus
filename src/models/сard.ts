import mongoose from 'mongoose';

export interface ICard extends mongoose.Document {
  name: string;
  link: string;
  owner: mongoose.ObjectId;
  likes: mongoose.ObjectId[];
  createdAt: Date;
}

const userSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model<ICard>('card', userSchema);
