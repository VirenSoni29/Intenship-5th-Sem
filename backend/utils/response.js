export const sendSuccess = (res, status = 200, message = '', extra = {}) => {
   return res.status(status).json({
      success: true,
      message,
      ...extra
   })
}

export const sendError = (res, status = 500, message = '', extra = {}) => {
   return res.status(status).json({
      success: false,
      message,
      ...extra
   })
}