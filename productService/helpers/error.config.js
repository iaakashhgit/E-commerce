exports.withErrorHandling = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    // Handle the error
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
