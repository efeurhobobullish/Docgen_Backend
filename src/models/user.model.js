import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    /* ======================
       BASIC INFORMATION
    ====================== */

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },

    avatar: {
      type: String,
      default: function () {
        const seed = encodeURIComponent(this.fullName.trim());
        return `https://api.dicebear.com/9.x/micah/svg?seed=${seed}`;
      },
    },

    /* ======================
       AUTH PROVIDER
    ====================== */

    provider: {
      type: String,
      enum: ["local", "github"],
      default: "local",
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },

    githubUsername: {
      type: String,
    },

    githubAccessToken: {
      type: String,
      select: false,
    },

    /* ======================
       ROLE & STATUS
    ====================== */

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.githubAccessToken;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

/* ======================
   PASSWORD HASHING
====================== */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ======================
   PASSWORD COMPARISON
====================== */

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model("User", userSchema);

export default UserModel;
