export function apiAuth(req, res, next) {
  if (req.headers['x-api-key'] !== 'APP_GAME_KEY') {
    return res.status(403).json({ message: '접근 불가' });
  }
  next();
}
