const { notify } = require('../../components/transactional')

// Helper function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const sendNotification = async (req, res, next) => {
  const { sender_name, destination_addr, message, callback_url } = req.body;

  if (!sender_name || !destination_addr || !message || !callback_url) {
    return res.status(400).json({
      status: 'fail',
      message: 'All fields are required'
    });
  }

  try {
    // Capitalize sender_name
    const capitalizedSenderName = capitalizeWords(sender_name);

    const response = await notify(
      'sms_nsl',
      'TEST',
      { message: message },
      capitalizedSenderName,
      destination_addr,
      ['sms'],
      true,
      callback_url
    );

    res.status(200).json({
      status: 'success',
      data: {
        destination_addr: destination_addr,
        message_id: response[0],
        delivery_status:'DELIVERED'
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { sendNotification };
