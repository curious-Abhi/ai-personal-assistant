import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    orderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      return existingUser; // Return existing user
    }

    // Create new user with 5000 credits
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      picture: args.picture,
      credits: 5000, // New users get 5000 credits
      orderId: args.orderId ?? undefined,
    });

    return { id: userId, ...args, credits: 5000 };
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});
