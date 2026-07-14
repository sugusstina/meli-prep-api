export function sendSuccess(
    res,
    {
      statusCode = 200,
      data
    }
  ) {
    return res.status(statusCode).json({
      data,
      error: null
    });
  }