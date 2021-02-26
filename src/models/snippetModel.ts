import { Schema, model, Types } from 'mongoose';

const snippetSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    code: {
      type: String,
    },
    user: {
      type: Types.ObjectId,
      required: true,
    }
  },
  { timestamps: true }
);

const Snippet = model('snippet', snippetSchema);

export default Snippet;
