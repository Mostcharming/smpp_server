const { notify } = require('../../components/transactional')

const sendNotification = async (req, res, next) => {
  const { sender_name, destination_addr, message, callback_url } = req.body

  if (!sender_name || !destination_addr || !message || !callback_url) {
    return res.status(400).json({
      status: 'fail',
      message: 'All fields are required'
    })
  }

  try {
    const response = await notify(
      'sms_telebran',
      'TEST',
      { message: message },
      sender_name,
      destination_addr,
      ['sms'],
      true,
      callback_url
    )

    res.status(200).json({
      status: 'success',
      data: response
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send notification'
    })
  }
}
module.exports = { sendNotification }
