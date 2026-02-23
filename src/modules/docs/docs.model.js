import { Schema, model, Types } from "mongoose";

const documentSchema = new Schema(
  {
    repository: {
      type: Types.ObjectId,
      ref: "Repository",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["readme"],
      required: true,
    },

    version: {
      type: Number,
      default: 1,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const DocumentModel = model("Document", documentSchema);

export default DocumentModel;