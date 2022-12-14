import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import React from 'react';

const Account = ({ session }: { session: any }) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null as string | null)
  const [emoji, setEmojId] = useState("")
  const [bid, setBid] = useState(0)
  const [allProfiles, setAllProfiles] = useState([])

  useEffect(() => {
    getProfiles();

// Setup

const channel = supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'profiles', filter: '' },
    (data: any) => {
      console.log('Change received!', data)
      setUsername(data.filter((p: { id: any; }) => p.id === user.id)[0].username)
      setEmojId(data.filter((p: { id: any; }) => p.id === user.id)[0].emoji)
      setAllProfiles(data as [])
    }
  )
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'users' },
    (payload: any) => console.log(payload)
  )
  .subscribe()

  }, [session])
  const { user } = session;

  const getProfiles = async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`id, username, emoji, bid`)
        .order(`id`)
      //.eq('id', user.id)
      //.single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.filter((p: { id: any; }) => p.id === user.id)[0].username)
        setEmojId(data.filter((p: { id: any; }) => p.id === user.id)[0].emoji)
        setAllProfiles(data as [])
      }
    } catch (error) {
      if (error) {
        const e = error as { message: string }
        alert(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()

    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username,
        emoji,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error) {
        const e = error as { message: string };
        alert(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateBid = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()

    try {
      setLoading(true)

      const updates = {
        id: user.id,
        bid,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error) {
        const e = error as { message: string };
        alert(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">

      <div>
        <ul className="list-group">
          {
            allProfiles.map((p: { id: string, username: string, bid: number }) => (
              <li key={p.id}>{p.username}
                {
                  p.id === user.id ? (
                    <form
                      onSubmit={updateBid} 
                      className="form-widget">
                      <span className="badge">{p.bid ? p.bid : "?"}</span>
                      <select defaultValue={p.bid || 0}
                      onChange={(e) => setBid(parseInt(e.target.value, 10) ?? 0)}
                      >
                        <option value={0} key="0" >?</option>
                        <option value={1} key="1" >1</option>
                        <option value={2} key="2" >2</option>
                        <option value={3} key="3" >3</option>
                        <option value={5} key="5" >5</option>
                        <option value={8} key="8" >8</option>
                        <option value={13} key="13" >13</option>
                      </select>
                      <button className="button primary block" disabled={loading}>
                        Send My Bid
                      </button>
                    </form>) : <span className="badge">{p.bid ? p.bid : "?"}</span>
                }
              </li>
            ))}
        </ul>
      </div>

      <p></p>

      <div> {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <div>Email: {session.user.email}</div>
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="emoji">My emoji</label>
            <input
              id="emoji"
              type="text"
              value={emoji || ''}
              onChange={(e) => setEmojId(e.target.value)}
            />
          </div>
          <div>
            <button className="button primary block" disabled={loading}>
              Update profile
            </button>
          </div>
        </form>
      )}
      </div>


      <p>      <button
        type="button"
        className="button block"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
      </p>
    </div>
  )
}

export default Account