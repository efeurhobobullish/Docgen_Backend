import { Schema, model, Types } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
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

const TeamModel = model("Team", teamSchema);

export default TeamModel;
