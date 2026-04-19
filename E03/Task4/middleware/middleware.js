export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`${timestamp} - ${req.method} ${req.url}`)
  next()
}

export const requireDebug = (req, res, next) => {
  const debug = req.query.debug

  if (!debug || debug !== 'true') {
    return res.status(400).json({
      error: 'Debug mode required. Add ?debug=true to access this endpoint'
    })
  }

  req.debugMode = true
  next()
}