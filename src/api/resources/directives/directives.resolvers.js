import { SchemaDirectiveVisitor } from 'graphql-tools'


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


  class RequireAuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;
      const { role } = this.args;
      field.resolve = async function(...args) {
        const [, , ctx] = args;
        
        if (ctx.req && ctx.req.user) {
          //if (role && (!ctx.req.user.role || !ctx.req.user.role.includes(role))) {
            //throw new AuthenticationError(
             // "You are not authorized to view this resource."
            //)
          //} else {
            console.log('RequireAuthDirective')
            console.log(ctx.req.authorized)
            console.log(ctx.user)
            const result = await resolve.apply(this, args);
            return result;
          //}
          } else {
          throw new Error("You must be signed in to view this resource.")
          } 
        }
    }
  }  






  export const directiveResolvers = {isAuthenticated, hasRole}
  export const schemaDirectives = {isAuthenticated: RequireAuthDirective}
