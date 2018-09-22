import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export const schema = {
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    required: true,
    type: String,
    select: false
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'role'
  }]
}



const userSchema = new mongoose.Schema(schema, {timestamps: true})

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret.password;
  ret.id = ret._id
  delete ret._id
  return ret;
}

userSchema.methods = {
  authenticate(plainTextPassword) {
    //console.log(this.password)
   
  return bcrypt.compare(plainTextPassword, this.password)
  
  },
  hashPassword(plaintTextPassword) {
    if (!plaintTextPassword) {
      throw new Error('Could not save user')
    }

    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(plaintTextPassword, salt)
  }
}

userSchema.pre('save', function(next) {
  const user = this
  console.log('saving...')
    if (user.isModified('password')) {
     user.password = user.hashPassword(user.password)
    }
  
  next()
  })


  userSchema.pre('findOneAndUpdate', function(next) {
    
    console.log(this._update.roles)
    
    next()
    })

export const User = mongoose.model('user', userSchema)
export const getObjectId = (id)=> mongoose.Types.ObjectId(id)
