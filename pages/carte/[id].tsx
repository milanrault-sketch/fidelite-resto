import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'

interface Client {
  id: string
  prenom: string
  telephone: string
  points: number
  created_at: string
}

interface Transaction {
  id: string
  type: 'gain' | 'reduction'
  points: number
  montant: number | null
  created_at: string
}

export default function Carte() {
  const router = useRouter()
  const { id } = router.query
  const [client, setClient] = useState<Client | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [config, setConfig] = useState({ points_par_euro: 1, points_par_reduction: 100, nom: 'Mon Restaurant' })
  const [codeMode, setCodeMode] = useState<'qr' | 'bar'>('qr')
  const qrRef = useRef<HTMLDivElement>(null)
  const [qrLoaded, setQrLoaded] = useState(false)

  useEffect(() => {
    if (!id) return
    loadClient()
    loadConfig()
    const interval = setInterval(loadClient, 10000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    if (client && !qrLoaded && codeMode === 'qr') loadQR()
  }, [client, codeMode])

  async function loadClient() {
    const { data } = await supabase.from('clients').select('*').eq('id', id).single()
    if (data) setClient(data)
    const { data: tx } = await supabase.from('transactions').select('*').eq('client_id', id).order('created_at', { ascending: false }).limit(10)
    if (tx) setTransactions(tx)
  }

  async function loadConfig() {
    const { data } = await supabase.from('restaurants').select('*').limit(1).single()
    if (data) setConfig({ points_par_euro: data.points_par_euro, points_par_reduction: data.points_par_reduction, nom: data.nom })
  }

  async function loadQR() {
    if (!qrRef.current || !client) return
    try {
      const QRCode = (await import('qrcode')).default
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, client.id, { width: 150, margin: 1, color: { dark: '#0F6E56', light: '#FFFFFF' } })
      qrRef.current.innerHTML = ''
      qrRef.current.appendChild(canvas)
      setQrLoaded(true)
    } catch (e) { console.error(e) }
  }

  function getLevel(pts: number) {
    if (pts < 200) return { label: 'Bronze', className: 'badge-bronze' }
    if (pts < 500) return { label: 'Argent', className: 'badge-argent' }
    return { label: 'Or', className: 'badge-or' }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  if (!client) return (
    <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ color: '#888', fontSize: 14 }}>Chargement...</div>
    </div>
  )

  const threshold = config.points_par_reduction
  const pct = Math.min(100, Math.round((client.points % threshold) / threshold * 100))
  const reductionDispo = Math.floor(client.points / threshold)
  const remaining = threshold - (client.points % threshold)
  const level = getLevel(client.points)

  return (
    <>
      <Head>
        <title>Ma Carte — {config.nom}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1D9E75" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Fidélité" />
      </Head>
      <div className="app">
        <div className="screen active">
          <div className="loyalty-card">
            <div className="card-brand">Carte Fidélité</div>
            <div className="card-name">{config.nom}</div>
            <div className="card-bottom">
              <div>
                <span className="card-pts">{client.points}</span>
                <span className="card-pts-label">pts</span>
              </div>
              <div>
                <div style={{ textAlign: 'right', marginBottom: 4 }}>
                  <span className={`badge ${level.className}`} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>{level.label}</span>
                </div>
                <div className="card-id">{client.id.slice(0, 8).toUpperCase()}</div>
              </div>
            </div>
          </div>
          <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Vers la prochaine réduction</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--green)' }}>{pct}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
            {reductionDispo > 0
              ? <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500 }}>🎉 {reductionDispo}€ de réduction disponibles !</div>
              : <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Encore {remaining} pts pour une réduction</div>
            }
          </div>
          <div className="section">
            <div style={{ textAlign: 'center', marginBottom: 10, fontSize: 13, color: 'var(--text-muted)' }}>Montre ce code à la caisse</div>
            {codeMode === 'qr' ? <div className="qr-wrap"><div ref={qrRef} /></div> : <div className="qr-wrap"><BarcodeDisplay value={client.id.replace(/-/g, '').slice(0, 12).toUpperCase()} /></div>}
            <div className="qr-hint">{client.id.slice(0, 8).toUpperCase()}</div>
            <div style={{ textAlign: 'center' }}>
              <button className="toggle-btn" onClick={() => { setCodeMode(codeMode === 'qr' ? 'bar' : 'qr'); setQrLoaded(false) }}>
                {codeMode === 'qr' ? 'Afficher en code-barres' : 'Afficher en QR code'}
              </button>
            </div>
          </div>
          <div className="section">
            <div className="section-title">Historique</div>
            {transactions.length === 0
              ? <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Aucune transaction pour l'instant</div>
              : transactions.map(tx => (
                <div className="history-item" key={tx.id}>
                  <div>
                    <div className="h-desc">{tx.type === 'gain' ? `Commande${tx.montant ? ` ${tx.montant}€` : ''}` : 'Réduction utilisée'}</div>
                    <div className="h-date">{formatDate(tx.created_at)}</div>
                  </div>
                  <div className={`h-pts ${tx.type === 'gain' ? 'pts-gain' : 'pts-use'}`}>{tx.type === 'gain' ? '+' : '-'}{tx.points} pts</div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

function BarcodeDisplay({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, 240, 60)
    let x = 12
    ctx.fillStyle = '#0F6E56'
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i)
      for (let b = 6; b >= 0; b--) {
        if ((code >> b) & 1) ctx.fillRect(x, 4, 2, 40)
        x += 3
      }
      x += 2
    }
    ctx.fillStyle = '#888'
    ctx.font = '9px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(value, 120, 58)
  }, [value])
  return <canvas ref={canvasRef} width={240} height={60} style={{ display: 'block', margin: '0 auto' }} />
}
