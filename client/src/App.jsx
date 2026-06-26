import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewPCs from './pages/ViewPCs'
import EditPC from './pages/EditPC'
import CreatePC from './pages/CreatePC'
import PCDetails from './pages/PCDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <CreatePC title='RIG BUILDER | Customize' />
    },
    {
      path: '/pcs',
      element: <ViewPCs title='RIG BUILDER | My Builds' />
    },
    {
      path: '/pcs/:id',
      element: <PCDetails title='RIG BUILDER | View' />
    },
    {
      path: '/edit/:id',
      element: <EditPC title='RIG BUILDER | Edit' />
    }
  ])

  return (
    <div className='app'>

      <Navigation />

      { element }

    </div>
  )
}

export default App
