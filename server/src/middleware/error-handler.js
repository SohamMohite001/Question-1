export function notFoundHandler(_request, response) {
  response.status(404).json({ success: false, error: 'Route not found.' });
}

export function errorHandler(error, _request, response, _next) {
  if (response.headersSent) return;
  if (error?.type === 'entity.parse.failed') {
    response.status(400).json({ success: false, error: 'Request body must contain valid JSON.' });
    return;
  }
  if (error?.type === 'entity.too.large') {
    response.status(413).json({ success: false, error: 'Request body is too large.' });
    return;
  }
  response.status(error.statusCode ?? 500).json({
    success: false,
    error: error.statusCode ? error.message : 'An unexpected server error occurred.',
  });
}