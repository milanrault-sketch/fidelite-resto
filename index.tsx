import { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

interface Client {
  id: string
  prenom: string
  telephone: string
  points: number
}

interface Config {
  id?: string
  nom: string
  points_par_euro: number
  points_par_reduction: number
}

export default function Commercant() {
  const [activeTab, setActiveTab] = useState<'scan' | 'clients' | 'config'>('scan')
  const [telephone, setTelephone] = useState('')
  const [foundClient, setFoundClient] = useState<Client | null>(null)
  const [montant, setMontant] = useState('15')
  const [redeemPts, setRedeemPts] = useState('100')
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [config, setConfig] = useState<Config>({ nom: 'Mon Restaurant', points_par_euro: 1, points_par_reduction: 100 })
  const [stats, setStats] = useState({ total_clients: 0, total_points: 0, total_reductions: 0 })
  const [pinOk, setPinOk] = useState(false)
  const [pin, setPin] = useState('')
  const PIN = '1234' // à changer selon besoin

  useEffect(() => {
    loadConfig()
    loadClients()
  }, [])

  async function loadConfig() {
    const { data } = await supabase.from('restaurants').select('*').limit(1).single()
    if (data) setConfig(data)
  }

  async function loadClients() {
    const { data } = await supabase.from('clients').select('*').order('points', { ascending: false })
    if (data) {
      setClients(data)
      setStats({
        total_clients: data.length,
        total_points: data.reduce((a: number, c: Client) => a + c.points, 0),
        total_reductions: 0
      })
    }
  }

  function showFeedback(msg: string, type: 'success' | 'error') {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback(null), 3000)
  }

  async function lookupClient() {
    setFoundClient(null)
    const tel = telephone.replace(/\s/g, '')
    const { data } = await supabase.from('clients').select('*').eq('telephone', tel).single()
    if (data) setFoundClient(data)
    else showFeedback('Aucun client trouvé avec ce numéro.', 'error')
  }

  async function addPoints() {
    if (!foundClient) { showFeedback('Cherche d\'abord un client.', 'error'); return }
    const amt = parseFloat(montant)
    const pts = Math.round(amt * config.points_par_euro)
    const newPoints = foundClient.points + pts

    await supabase.from('clients').update({ points: newPoints }).eq('id', foundClient.id)
    await supabase.from('transactions').insert({
      client_id: foundClient.id,
      type: 'gain',
      points: pts,
      montant: amt
    })

    setFoundClient({ ...foundClient, points: newPoints })
    showFeedback(`+${pts} points ajoutés à ${foundClient.prenom} !`, 'success')
    loadClients()
  }

  async function redeemPoints() {
    if (!foundClient) { showFeedback('Cherche d\'abord un client.', 'error'); return }
    const pts = parseInt(redeemPts)
    if (foundClient.points < pts) { showFeedback('Points insuffisants.', 'error'); return }
    const reduction = (pts / config.points_par_reduction).toFixed(2)
    const newPoints = foundClient.points - pts

    await supabase.from('clients').update({ points: newPoints }).eq('id', foundClient.id)
    await supabase.from('transactions').insert({
      client_id: foundClient.id,
      type: 'reduction',
      points: pts,
      montant: parseFloat(reduction)
    })

    setFoundClient({ ...foundClient, points: newPoints })
    showFeedback(`Réduction de ${reduction}€ appliquée !`, 'success')
    loadClients()
  }

  async function saveConfig() {
    if (config.id) {
      await supabase.from('restaurants').update({
        nom: config.nom,
        points_par_euro: config.points_par_euro,
        points_par_reduction: config.points_par_reduction
      }).eq('id', config.id)
    } else {
      const { data } = await supabase.from('restaurants').insert({
        nom: config.nom,
        points_par_euro: config.points_par_euro,
        points_par_reduction: config.points_par_reduction
      }).select().single()
      if (data) setConfig(data)
    }
    showFeedback('Configuration sauvegardée !', 'success')
  }

  function getLevel(pts: number) {
    if (pts < 200) return { label: 'Bronze', cls: 'badge-bronze' }
    if (pts < 500) return { label: 'Argent', cls: 'badge-argent' }
    return { label: 'Or', cls: 'badge-or' }
  }

  if (!pinOk) return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>🔐</div>
      <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Espace commerçant</div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Entre ton code PIN</div>
      <input className="input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} style={{ maxWidth: 200, textAlign: 'center', marginBottom: 12 }} />
      <button className="btn btn-primary" style={{ maxWidth: 200 }} onClick={() => { if (pin === PIN) setPinOk(true); else showFeedback('PIN incorrect', 'error') }}>Accéder</button>
      {feedback && <div className={`feedback ${feedback.type}`} style={{ marginTop: 12 }}>{feedback.msg}</div>}
    </div>
  )

  return (
    <>
      <Head>
        <title>Commerçant — {config.nom}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app">
        <nav className="nav">
          <button className={`nav-tab ${activeTab === 'scan' ? 'active' : ''}`} onClick={() => setActiveTab('scan')}>Scanner</button>
          <button className={`nav-tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => { setActiveTab('clients'); loadClients() }}>Clients</button>
          <button className={`nav-tab ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')}>Config</button>
        </nav>

        {/* SCAN */}
        {activeTab === 'scan' && (
          <div className="screen active">
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Clients</div><div className="stat-value">{stats.total_clients}</div></div>
              <div className="stat-card"><div className="stat-label">Points distribués</div><div className="stat-value">{stats.total_points}</div></div>
            </div>

            <div className="section">
              <div className="section-title">Trouver un client</div>
              <div className="input-row">
                <input className="input" type="tel" placeholder="Numéro de téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} />
                <button className="btn btn-primary" style={{ width: 'auto', padding: '0 16px' }} onClick={lookupClient}>Chercher</button>
              </div>

              {feedback && <div className={`feedback ${feedback.type}`}>{feedback.msg}</div>}

              {foundClient && (
                <div className="customer-card">
                  <div className="customer-name">{foundClient.prenom}</div>
                  <div className="customer-pts">{foundClient.points} points · {foundClient.telephone}</div>
                  <span className={`badge ${getLevel(foundClient.points).cls}`}>{getLevel(foundClient.points).label}</span>
                </div>
              )}

              <div className="input-label">
                <span>Montant commande :</span>
                <input className="input-sm" type="number" value={montant} onChange={e => setMontant(e.target.value)} />
                <span>€</span>
                <span style={{ color: 'var(--green)', fontWeight: 500, fontSize: 13 }}>
                  = {Math.round(parseFloat(montant || '0') * config.points_par_euro)} pts
                </span>
              </div>
              <button className="btn btn-secondary" onClick={addPoints} style={{ marginBottom: 10 }}>+ Ajouter les points</button>

              <div className="input-label" style={{ marginTop: 8 }}>
                <span>Points à utiliser :</span>
                <input className="input-sm" type="number" value={redeemPts} onChange={e => setRedeemPts(e.target.value)} />
                <span style={{ color: 'var(--red)', fontWeight: 500, fontSize: 13 }}>
                  = {(parseInt(redeemPts || '0') / config.points_par_reduction).toFixed(2)}€
                </span>
              </div>
              <button className="btn btn-danger" onClick={redeemPoints}>- Utiliser des points</button>
            </div>
          </div>
        )}

        {/* CLIENTS */}
        {activeTab === 'clients' && (
          <div className="screen active">
            <div className="section">
              <div className="section-title">Tous les clients ({clients.length})</div>
              {clients.map(c => (
                <div className="client-row" key={c.id}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{c.prenom}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.telephone} · {getLevel(c.points).label}</div>
                  </div>
                  <span className="client-pts">{c.points} pts</span>
                </div>
              ))}
              {clients.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>Aucun client encore inscrit</div>}
            </div>
          </div>
        )}

        {/* CONFIG */}
        {activeTab === 'config' && (
          <div className="screen active">
            <div className="section">
              <div className="section-title">Programme de fidélité</div>
              <div className="config-row">
                <span className="config-label">Nom du restaurant</span>
                <input className="input-sm" type="text" value={config.nom} onChange={e => setConfig({ ...config, nom: e.target.value })} style={{ width: 130, textAlign: 'left', padding: '0 10px' }} />
              </div>
              <div className="config-row">
                <span className="config-label">Points par euro dépensé</span>
                <input className="input-sm" type="number" value={config.points_par_euro} onChange={e => setConfig({ ...config, points_par_euro: parseFloat(e.target.value) })} />
              </div>
              <div className="config-row">
                <span className="config-label">Points pour 1€ de réduction</span>
                <input className="input-sm" type="number" value={config.points_par_reduction} onChange={e => setConfig({ ...config, points_par_reduction: parseInt(e.target.value) })} />
              </div>
              <button className="btn btn-primary" onClick={saveConfig} style={{ marginTop: 16 }}>Enregistrer</button>
              {feedback && <div className={`feedback ${feedback.type}`} style={{ marginTop: 10 }}>{feedback.msg}</div>}
            </div>

            <div className="section">
              <div className="section-title">Lien d'inscription clients</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Partage ce lien à tes clients ou affiche le QR code en caisse</div>
              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px', fontSize: 12, fontFamily: 'DM Mono', wordBreak: 'break-all', color: 'var(--green-dark)' }}>
                {typeof window !== 'undefined' ? `${window.location.origin}/` : 'ton-app.vercel.app/'}
              </div>
            </div>

            <div className="section">
              <div className="section-title">Sécurité</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>PIN actuel : <strong>1234</strong></div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Pour changer le PIN, modifie la variable PIN dans le fichier <code>pages/commercant.tsx</code></div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
