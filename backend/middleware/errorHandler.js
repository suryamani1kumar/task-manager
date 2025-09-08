export function errorHandler(err, req, res, next) {
  console.error("Error:", err); // log error on server
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
}
