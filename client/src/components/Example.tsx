import { useBoundStore } from "../context"

export const Example = () => {
  const user = useBoundStore(state => state.user)
  const userState = useBoundStore(state => state.state)
  const login = useBoundStore(state => state.login)

  return (
    <div style={{ marginLeft: '1rem' }}>
      <p>user: {JSON.stringify(user)}</p>
      <p>state: {userState}</p>

      <button onClick={() => login({ name: 'Test', email: 'test@gmail.com', gender: 'Man', id: '242', lastname: 'LastTest' })}>LOGIN</button>
    </div>
  )
}