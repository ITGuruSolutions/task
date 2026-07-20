import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    joinDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const MongooseUser = mongoose.model('User', userSchema);

export let inMemoryUsers = [];
let useInMemory = false;

export function setUseInMemory(val) {
  useInMemory = val;
}

const UserProxy = new Proxy(MongooseUser, {
  get(target, prop, receiver) {
    if (useInMemory) {
      switch (prop) {
        case 'find':
          return () => {
            const result = [...inMemoryUsers];
            const query = {
              sort(_sortObj) {
                result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                return this;
              },
              then(resolve) {
                resolve(result);
              }
            };
            return query;
          };
        case 'findById':
          return (id) => {
            const user = inMemoryUsers.find((u) => u.id === id || u._id === id);
            return Promise.resolve(user || null);
          };
        case 'create':
          return (body) => {
            const id = new mongoose.Types.ObjectId().toString();
            const newUser = {
              ...body,
              id,
              _id: id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            inMemoryUsers.push(newUser);
            return Promise.resolve(newUser);
          };
        case 'findByIdAndUpdate':
          return (id, body, _options) => {
            const index = inMemoryUsers.findIndex((u) => u.id === id || u._id === id);
            if (index === -1) return Promise.resolve(null);
            const updatedUser = {
              ...inMemoryUsers[index],
              ...body,
              id,
              _id: id,
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
});

export { UserProxy as User };
