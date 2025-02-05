const DataAdapterInterface = require('../../../database/adapter')
const axios = require('axios')

const callback = async (req, res, next) => {

  const logResAdapter = new DataAdapterInterface('sms_callbacks')
  const smsResAdapter = new DataAdapterInterface('sms_responses')
  const smsReqAdapter = new DataAdapterInterface('sms_requests')
console.log(req.body)
  const logResData = {
    message_id: req.body.reference_id,
    status: req.body.stat,
    status_code: 200,
    done_date: req.body.done_date,
    operator: req.body.sub,
  
  }

  const requiredField = [
    'message_id',
    'status_code',
  ]

  try {
    await logResAdapter.create(logResData, requiredField)

    const smsRequest = await smsResAdapter.findOne({
      'response_message.reference_id': req.body.reference_id,
    });
    

   // if (!smsRequest) {
  //    return res
  //      .status(404)
  //      .json({ message: 'No corresponding SMS request found' })
  //  }
  //  const smsRe = await smsReqAdapter.findOne({
   //   request_id: smsRequest.request_id,
  //  });
    const callbackUrl = 'https://api.int.cryun.com/receive/telebrand/delivery'

    if (callbackUrl) {
      const callbackResponseData = {
        message_id: smsRequest.request_id,
        status: req.body.stat,
        done_date: req.body.done_date,
        done_time: req.body.dt,
        destination_addr: req.body.msisdn,
        dlvrd:req.body.dlvrd,
        sub:req.body.sub,
        text:req.body.text

      
      }

      await axios.post(callbackUrl, callbackResponseData)
    }

    return res
      .status(201)
      .json({ message: 'Callback stored and response sent successfully' })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'An error occurred', error: error.message })
  }
}

module.exports = { callback }
