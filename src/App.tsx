import { useState, useEffect } from 'react'
import './App.css';
// import { Provider } from 'react-supabase'
import React from 'react';
import Auth from './Auth'
import Account from './Account'
import { supabase } from './supabaseClient'



function App() {
  //const [count, setCount] = useState(0)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


  return (
    <div >
      {!session ? (
        <Auth />
      ) : (
          <Account key={session.user.id} session={session} />
          // <Provider value={supabase}>
          //   <div className="App">
          //     <h1>Fib Bid</h1>
          //     <div className="card">
          //       <button onClick={() => setCount((count) => count + 1)}>
          //         count is {count}
          //       </button>
          //     </div>
          //   </div>
          //   <Bids />
          // </Provider>
        )}
    </div>

  )
}

export default App
