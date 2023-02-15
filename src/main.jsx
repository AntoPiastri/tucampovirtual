import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import persistStore from 'redux-persist/es/persistStore'
import { PersistGate } from 'redux-persist/integration/react'
import { Backita } from './Backita'
import { store } from './store'
import './styles.css'

let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <Provider store={ store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Backita />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  
)
