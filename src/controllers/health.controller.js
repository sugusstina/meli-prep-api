export function getHealth(req, res) {
    res.status(200).json({
      data: {
        status: "ok",
        service: "meli-prep-api"
      },
      error: null
    });
  }