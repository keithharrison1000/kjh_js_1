import mongoose from 'mongoose'

export const schema = {

  name: {
    type: String,
    required: [true, 'role must have a name']
  },

  type: {
    type: String,
    required: [true, 'role must have a type']
  }
}

const roleSchema = new mongoose.Schema(schema)

export const Role = mongoose.model('role', roleSchema)
