import apollo, { onLogin } from '@/plugins/apollo'
import LoginMutation from './../graphql/Login.gql'
import SignUpMutation from './../graphql/SignUp.gql'
import UserQuery from './../graphql/User.gql'

const login = async variables => { // arrow function
  const response = await apollo.mutate({
    mutation: LoginMutation,
    variables
  })
  const { login } = response.data
  await onLogin(apollo, login.token)
  return login
}

const signup = async variables => { // arrow function
  const response = await apollo.mutate({
    mutation: SignUpMutation,
    variables
  })
  const { signup } = response.data
  await onLogin(apollo, signup.token)
  return signup
}

const user = async (options = {}) => {
  const response = await apollo.query({
    query: UserQuery,
    ...options // para usar o fetch polucy
  })

  return response.data.user // user é o nome da query
}

export default {
  login,
  signup,
  user
}
