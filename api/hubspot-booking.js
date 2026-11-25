const https = require('https');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.HUBSPOT_API_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({ error: 'HubSpot token not configured' });
  }

  const payload = req.body;
  if (!payload || !payload.payload) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const booking = payload.payload;
  const attendee = booking.attendees && booking.attendees[0];
  if (!attendee) {
    return res.status(400).json({ error: 'No attendee data' });
  }

  const nameParts = (attendee.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const responses = booking.responses || {};
  const phone = responses.phone?.value || responses.location?.value || '';
  const company = responses.company?.value || '';
  const website = responses.website?.value || '';

  const contactProperties = {
    email: attendee.email,
    firstname: firstName,
    lastname: lastName,
    lifecyclestage: 'lead',
    lead_source: 'meta_ads',
    hs_lead_status: 'NEW',
  };
  if (phone) contactProperties.phone = phone;
  if (company) contactProperties.company = company;
  if (website) contactProperties.website = website;

  const body = JSON.stringify({
    properties: Object.entries(contactProperties).map(([property, value]) => ({
      property,
      value,
    })),
  });

  try {
    const result = await apiRequest(TOKEN, 'POST', '/contacts/v1/contact/createOrUpdate/email/' + encodeURIComponent(attendee.email), body);
    return res.status(200).json({ ok: true, vid: result.vid });
  } catch (err) {
    return res.status(500).json({ error: 'HubSpot API failed', detail: err.message });
  }
};

function apiRequest(token, method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.hubapi.com',
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    if (body) options.headers['Content-Length'] = Buffer.byteLength(body);

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.message || JSON.stringify(parsed)));
          }
        } catch {
          resolve(data);
        }
      });
    });
    request.on('error', reject);
    if (body) request.write(body);
    request.end();
  });
}
