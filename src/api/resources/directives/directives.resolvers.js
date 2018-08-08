const isAuthenticated = (next, source, args, ctx) => {
  //isLoggedIn(ctx)
  console.log('isAuthenticated')
    return next()
  }

const hasRole = (next, source, { roles }, ctx) => {
  //const { role } = isLoggedIn(ctx)
  //if (roles.includes(role)) {
   console.log('hasRole') 
  return next()
  }

  export const directiveResolvers = {isAuthenticated, hasRole}
