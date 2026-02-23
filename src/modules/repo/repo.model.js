import { Schema, model, Types } from "mongoose";

const repositorySchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    repoId: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
    },

    defaultBranch: {
      type: String,
      default: "main",
    },

    isPrivate: {
      type: Boolean,
      default: false,
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

repositorySchema.index({ user: 1, repoId: 1 }, { unique: true });

const RepositoryModel = model("Repository", repositorySchema);

export default RepositoryModel;