const https = require('https');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.META_CAPI_TOKEN;
  const PIXEL_ID = '1638788897998440';

  if (!TOKEN) {
    return res.status(500).json({ error: 'CAPI token not configured' });
  }

  const { event_name, event_id, event_source_url, user_data } = req.body;

  if (!event_name || !event_id) {
    return res.status(400).json({ error: 'Missing event_name or event_id' });
  }

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: 'website',
        user_data: {
          client_ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress,
          client_user_agent: req.headers['user-agent'],
          ...(user_data || {}),
        },
      },
    ],
  };

  const body = JSON.stringify(payload);
  const path = `/v21.0/${PIXEL_ID}/events?access_token=${TOKEN}`;

  try {
    const result = await new Promise((resolve, reject) => {
      const request = https.request(
        { hostname: 'graph.facebook.com', path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
        (response) => {
          let data = '';
          response.on('data', (chunk) => { data += chunk; });
          response.on('end', () => {
            try { resolve(JSON.parse(data)); } catch { resolve(data); }
          });
        }
      );
      request.on('error', reject);
      request.write(body);
      request.end();
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send event' });
  }
};
