module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const origin = req.headers.origin || '';
  if (origin && !origin.includes(req.headers.host)) return res.status(403).json({ ok: false });

  const phone = process.env.CALLMEBOT_PHONE;
  const key = process.env.CALLMEBOT_KEY;
  if (!phone || !key) return res.status(500).json({ ok: false, error: 'Faltan variables de entorno' });

  const text = String((req.body && req.body.text) || '').slice(0, 1500);
  if (!text.includes('MARKITOS MB') || !text.includes('Folio')) return res.status(400).json({ ok: false });

  const url =
    'https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(phone) +
    '&apikey=' + encodeURIComponent(key) +
    '&text=' + encodeURIComponent('🔔 NUEVO PEDIDO\n\n' + text);

  try {
    const r = await fetch(url);
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
