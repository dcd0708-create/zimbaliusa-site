// Zimbali USA — booking form handler
// Receives POST /api/contact, sends via Resend, replies with JSON.

const ALLOWED_ORIGINS = new Set([
  'https://zimbaliusa.com',
  'https://www.zimbaliusa.com',
]);
const BASE_CORS = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
};
const corsFor = (request) => {
  const origin = request.headers.get('Origin') || '';
  return {
    ...BASE_CORS,
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://zimbaliusa.com',
  };
};

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const buildEmail = (d) => {
  const rows = [
    ['Name', d.name],
    ['Email', d.email],
    ['Phone', d.phone],
    ['City / Zip', d.city],
    ['Interested in', d.interest],
    ['Guests', d.guests],
    ['Event date', d.date],
    ['Date flexible?', d.flexible ? 'Yes' : 'No'],
    ['Occasion', d.occasion || '—'],
    ['Dietary needs', d.diet || '—'],
    ['Notes', d.notes || '—'],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v || '—'}`).join('\n');
  const html = `<div style="font-family:Georgia,serif;max-width:600px;padding:24px">
    <h2 style="color:#241911;margin:0 0 16px">New booking inquiry — zimbaliusa.com</h2>
    <table style="border-collapse:collapse;width:100%">
      ${rows.map(([k, v]) => `<tr>
        <td style="padding:8px 12px;background:#f7f2ea;font-weight:600;width:170px;vertical-align:top">${escapeHtml(k)}</td>
        <td style="padding:8px 12px;background:#fff;border-left:2px solid #B54A1E">${escapeHtml(v || '—')}</td>
      </tr>`).join('')}
    </table>
    <p style="margin-top:20px;font-size:13px;color:#666">Reply directly to this email — it goes to <strong>${escapeHtml(d.email)}</strong>.</p>
  </div>`;
  return { text, html };
};

export default {
  async fetch(request, env) {
    const CORS = corsFor(request);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS });
    }

    let data;
    try {
      const ct = request.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await request.json();
      } else {
        const fd = await request.formData();
        data = Object.fromEntries(fd.entries());
        data.flexible = fd.get('flexible') === 'on' || fd.get('flexible') === 'true';
      }
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'bad_body' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Honeypot
    if (data.website || data.hp) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    // Basic validation
    const required = ['name', 'email', 'phone', 'city', 'interest', 'guests', 'date'];
    for (const k of required) {
      if (!data[k] || String(data[k]).trim() === '') {
        return new Response(JSON.stringify({ ok: false, error: `missing_${k}` }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }
    }

    const { text, html } = buildEmail(data);
    const subject = `New inquiry: ${data.interest} for ${data.guests} on ${data.date} — ${data.name}`;

    // Send via Resend
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Zimbali USA <bookings@zimbaliusa.com>',
        to: ['alecia@zimbaliusa.com'],
        reply_to: data.email,
        subject,
        text,
        html,
      }),
    });

    if (!resendResp.ok) {
      const errBody = await resendResp.text();
      console.error('Resend error:', resendResp.status, errBody);
      return new Response(JSON.stringify({ ok: false, error: 'send_failed', debug: { status: resendResp.status, body: errBody.slice(0, 400) } }), {
        status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  },
};
