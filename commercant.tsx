@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --green: #1D9E75;
  --green-dark: #0F6E56;
  --green-light: #E1F5EE;
  --red-light: #FCEBEB;
  --red: #A32D2D;
  --bg: #F7F7F5;
  --card: #FFFFFF;
  --border: rgba(0,0,0,0.08);
  --text: #1a1a1a;
  --text-muted: #888;
  --radius: 16px;
  --radius-sm: 10px;
}

html, body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.app {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg);
}

/* NAV */
.nav {
  display: flex;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-tab {
  flex: 1;
  padding: 15px 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  color: var(--text-muted);
  border: none;
  background: none;
  font-family: 'DM Sans', sans-serif;
  transition: color .2s;
  border-bottom: 2px solid transparent;
}
.nav-tab.active {
  color: var(--green);
  border-bottom-color: var(--green);
}

/* SCREENS */
.screen { display: none; padding: 16px; }
.screen.active { display: block; }

/* LOYALTY CARD */
.loyalty-card {
  background: linear-gradient(135deg, #1D9E75 0%, #085041 100%);
  border-radius: 20px;
  padding: 26px;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 14px;
  box-shadow: 0 8px 32px rgba(29,158,117,0.3);
}
.loyalty-card::before {
  content: '';
  position: absolute;
  right: -40px; top: -40px;
  width: 160px; height: 160px;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
}
.loyalty-card::after {
  content: '';
  position: absolute;
  right: 30px; bottom: -50px;
  width: 110px; height: 110px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}
.card-brand { font-size: 11px; font-weight: 500; opacity: 0.7; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
.card-name { font-size: 21px; font-weight: 600; margin-bottom: 24px; }
.card-bottom { display: flex; align-items: flex-end; justify-content: space-between; }
.card-pts { font-size: 46px; font-weight: 300; line-height: 1; }
.card-pts-label { font-size: 12px; opacity: 0.7; margin-left: 4px; margin-bottom: 8px; }
.card-id { font-family: 'DM Mono', monospace; font-size: 11px; opacity: 0.55; }

/* BUTTONS */
.btn { width: 100%; padding: 13px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 500; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: opacity .15s, transform .1s; }
.btn:active { transform: scale(0.98); }
.btn-primary { background: var(--green); color: #fff; }
.btn-secondary { background: var(--green-light); color: var(--green-dark); }
.btn-danger { background: var(--red-light); color: var(--red); }
.btn-black { background: #000; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; }

/* CARD SECTIONS */
.section {
  background: var(--card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 16px;
  margin-bottom: 12px;
}
.section-title { font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }

/* PROGRESS */
.progress-bar { height: 6px; background: #eee; border-radius: 99px; overflow: hidden; margin: 10px 0 8px; }
.progress-fill { height: 100%; background: var(--green); border-radius: 99px; transition: width .5s ease; }

/* QR */
.qr-wrap { text-align: center; padding: 8px 0; }
.qr-hint { font-size: 12px; color: var(--text-muted); margin-top: 10px; font-family: 'DM Mono', monospace; }
.toggle-btn { font-size: 12px; color: var(--green); cursor: pointer; margin-top: 8px; display: inline-block; background: none; border: none; font-family: 'DM Sans', sans-serif; }

/* HISTORY */
.history-item { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--border); }
.history-item:last-child { border-bottom: none; }
.h-desc { font-size: 13px; }
.h-date { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.h-pts { font-size: 13px; font-weight: 500; }
.pts-gain { color: var(--green); }
.pts-use { color: var(--red); }

/* STATS */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; }
.stat-label { font-size: 11px; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { font-size: 24px; font-weight: 500; }

/* INPUTS */
.input-row { display: flex; gap: 8px; margin-bottom: 10px; }
.input { flex: 1; height: 42px; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); outline: none; transition: border-color .2s; }
.input:focus { border-color: var(--green); }
.input-sm { width: 90px; height: 38px; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0 10px; font-size: 14px; text-align: center; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); outline: none; }
.input-label { font-size: 13px; color: var(--text-muted); display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }

/* FEEDBACK */
.feedback { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; margin-bottom: 10px; }
.feedback.success { background: var(--green-light); color: var(--green-dark); }
.feedback.error { background: var(--red-light); color: var(--red); }

/* CUSTOMER CARD */
.customer-card { background: var(--bg); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 12px; }
.customer-name { font-size: 15px; font-weight: 500; }
.customer-pts { font-size: 13px; color: var(--text-muted); }
.badge { display: inline-block; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 99px; margin-top: 4px; }
.badge-bronze { background: #FFF0E0; color: #A0522D; }
.badge-argent { background: #F0F0F0; color: #555; }
.badge-or { background: #FFF8DC; color: #B8860B; }

/* CLIENTS LIST */
.client-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid var(--border); }
.client-row:last-child { border-bottom: none; }
.client-pts { background: var(--green-light); color: var(--green-dark); font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 99px; }

/* CONFIG */
.config-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
.config-row:last-child { border-bottom: none; }
.config-label { font-size: 14px; color: var(--text); }

/* INSCRIPTION */
.inscription-wrap { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 24px; }
.inscription-logo { width: 60px; height: 60px; background: var(--green); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.inscription-title { font-size: 26px; font-weight: 600; margin-bottom: 8px; }
.inscription-sub { font-size: 15px; color: var(--text-muted); margin-bottom: 32px; line-height: 1.5; }
.form-group { margin-bottom: 14px; }
.form-label { font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; display: block; }
.form-input { width: 100%; height: 48px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); padding: 0 16px; font-size: 15px; font-family: 'DM Sans', sans-serif; background: var(--card); color: var(--text); outline: none; transition: border-color .2s; }
.form-input:focus { border-color: var(--green); }
