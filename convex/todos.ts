import { ConvexError, v } from "convex/values";
// ConvexError: Jab koi galti hoti hai (e.g. todo na mile),
//  to ye custom error throw karte hain.

// v: Validation schema —
// input ko type-safe banane ke liye use hota hai. Jaise string, id, etc.
import { mutation, query } from "./_generated/server";
// mutation & query: Convex me 2 types ke functions hote hain:

// query = read-only data fetch
// mutation = write operations (insert/update/delete)
export const getTodos = query({
    handler: async(ctx) => {
        const todos  = await ctx.db.query("todos").order("desc").collect();
        return todos;
    },
});
// query({ handler }): Ye ek query function define karta hai.
// ctx: Context hota hai jisme db (database) access hota hai.
// ctx.db.query("todos"): todos naam ki table se data laa rahe hain.
// .collect(): Query ka result array me convert karta hai.

export const addTodo = mutation({
    args:{text: v.string()},
    handler: async(ctx,args) => {
        const todoId = await ctx.db.insert("todos",{
            text: args.text,
            isCompleted: false,
        });
        return todoId;
    },
});
// mutation({ args, handler }): Ye write operation hai.
// args: { text: v.string() }: 
// Input me ek text string lena zaruri hai (validation).

// ctx.db.insert("todos", {...}):
// todos table me ek naya record insert kar rahe hain.

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError("Todo not found");

    await ctx.db.patch(args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

export const deleteTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler:async(ctx,args)=>{
        await ctx.db.delete(args.id);
    },
});

export const updateTodo = mutation({
    args: {
        id: v.id("todos"),
        text: v.string(),
    },
    handler: async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            text: args.text,
        });
    },
});

export const clearAllTodos = mutation({
    handler: async(ctx)=>{
        const todos = await ctx.db.query("todos").collect();
        for (const todo of todos) {
            await ctx.db.delete(todo._id);
        }
        return {deleteCount:todos.length};
    },
});

// todo._id = 
// Convex me har document ka internal ID hota hai 
// (underscore _ ke saath)