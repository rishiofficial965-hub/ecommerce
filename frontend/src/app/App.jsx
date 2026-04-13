import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app.store'
import { routes } from './app.routes'

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  )
}

export default App