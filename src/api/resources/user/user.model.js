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
    select: true
  }
}

const userSchema = new mongoose.Schema(schema, {timestamps: true})

userSchema.methods = {
  authenticate(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password)
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
  
    if (user.isModified('password')) {
     user.password = user.hashPassword(user.password)
    }
  
  next()
  })

export const User = mongoose.model('user', userSchema)
