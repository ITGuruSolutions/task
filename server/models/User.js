import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive'] },
    joinDate: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Mongoose Model
const MongooseUserModel = mongoose.model('User', userSchema);

// In-memory Database Store fallback
export const inMemoryUsers = [];
let useInMemory = false;

export const setUseInMemory = (val) => {
  useInMemory = val;
};

// Proxy handler to intercept Mongoose operations
const handler = {
  get(target, prop, receiver) {
    if (useInMemory) {
      switch (prop) {
        case 'find':
          return () => Promise.resolve(inMemoryUsers);
        case 'findById':
          return (id) => {
            const user = inMemoryUsers.find((u) => u.id === id || u._id === id);
            return Promise.resolve(user || null);
          };
        case 'create':
          return (userData) => {
            const id = new mongoose.Types.ObjectId().toString();
            const newUser = {
              ...userData,
              id,
              _id: id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            inMemoryUsers.unshift(newUser);
            return Promise.resolve(newUser);
          };
        case 'findByIdAndUpdate':
          return (id, updateData) => {
            const index = inMemoryUsers.findIndex((u) => u.id === id || u._id === id);
            if (index === -1) return Promise.resolve(null);
            
            const updatedUser = {
              ...inMemoryUsers[index],
              ...updateData,
              updatedAt: new Date().toISOString(),
            };
            inMemoryUsers[index] = updatedUser;
            return Promise.resolve(updatedUser);
          };
        case 'findByIdAndDelete':
          return (id) => {
            const index = inMemoryUsers.findIndex((u) => u.id === id || u._id === id);
            if (index === -1) return Promise.resolve(null);
            const deletedUser = inMemoryUsers[index];
            inMemoryUsers.splice(index, 1);
            return Promise.resolve(deletedUser);
          };
        case 'countDocuments':
          return () => Promise.resolve(inMemoryUsers.length);
        case 'insertMany':
          return (users) => {
            const newUsers = users.map((u) => {
              const id = new mongoose.Types.ObjectId().toString();
              return {
                ...u,
                id,
                _id: id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            });
            inMemoryUsers.push(...newUsers);
            return Promise.resolve(newUsers);
          };
        case 'deleteMany':
          return () => {
            inMemoryUsers.splice(0, inMemoryUsers.length);
            return Promise.resolve({ deletedCount: 0 });
          };
        default:
          break;
      }
    }
    return Reflect.get(target, prop, receiver);
  },
};

const UserProxy = new Proxy(MongooseUserModel, handler);

export { UserProxy as User };
