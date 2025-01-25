export default function sendResponse(res, status, data, succes, msg) {
    res.status(status).json({
      succes,
      msg,
      data: data,
    });
  }