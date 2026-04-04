export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' && req.url.includes('/login')) {
    // TODO: Connect to MongoDB or file store for authentication
    const { username, password } = req.body;
    
    // For now, accept any credentials and return a mock token
    if (username && password) {
      res.status(200).json({ token: 'mock-jwt-token-' + Date.now() });
    } else {
      res.status(400).json({ msg: 'Invalid Credentials' });
    }
  } else {
    res.status(405).json({ msg: 'Method Not Allowed' });
  }
}
