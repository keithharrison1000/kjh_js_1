import { Role } from './role.model'

const getRole = (_, {id}, {user}) => {
  return Role.findById(id).exec()
}

const allRoles = () => {
  return Role.find({}).exec()
}

const newRole = (_, {input}) => {
  return Role.create(input)
}

const updateRole = (_, {input}) => {
  const {id, ...update} = input

  return Role.findByIdAndUpdate(id, update, {new: true}).exec()
}

export const roleResolvers = {
  Query: {
    allRoles,
    Role: getRole
  },

  Mutation: {
    newRole,
    updateRole
  }
}

