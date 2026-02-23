import { Schema, model, Types } from "mongoose";

const teamSchema = new Schema(
  {
    /* ======================
       BASIC INFO
    ====================== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ======================
       MEMBERS
    ====================== */
    members: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
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

    /* ======================
       BILLING
    ====================== */
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    stripeCustomerId: {
      type: String,
    },

    /* ======================
       TEAM USAGE LIMITS
    ====================== */
    usage: {
      readmeGenerations: {
        type: Number,
        default: 0,
      },
      prSummaries: {
        type: Number,
        default: 0,
      },
      changelogGenerations: {
        type: Number,
        default: 0,
      },
      resetDate: {
        type: Date,
        default: () => {
          const now = new Date();
          now.setMonth(now.getMonth() + 1);
          return now;
        },
      },
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

/* ======================
   INDEXES
====================== */

// Prevent duplicate team names for same owner
teamSchema.index({ name: 1, owner: 1 }, { unique: true });

// Fast member lookup
teamSchema.index({ "members.user": 1 });

const TeamModel = model("Team", teamSchema);

export default TeamModel;