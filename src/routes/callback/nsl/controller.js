const DataAdapterInterface = require('../../../database/adapter')
const axios = require('axios')

const callback = async (req, res, next) => {

  const logResAdapter = new DataAdapterInterface('sms_callbacks')
  const smsReqAdapter = new DataAdapterInterface('sms_requests')

  const logResData = {
    message_id: req.body.smsc_id,
    status: req.body.stat,
    status_code: 200,
    done_date: req.body.done_date,
    operator: req.body.sub,
    // length: req.body.length,
    // page: req.body.page,
    // cost: req.body.cost
  }

  const requiredField = [
    'message_id',
    'status',
    'status_code',
    'done_date',
    // 'operator',
    // 'length',
    // 'page',
    // 'cost'
  ]

  try {
    await logResAdapter.create(logResData, requiredField)

    const smsRequest = await smsReqAdapter.findOne({
      request_id: req.body.sms_id
    })

    if (!smsRequest) {
      return res
        .status(404)
        .json({ message: 'No corresponding SMS request found' })
    }

    const callbackUrl = smsRequest.callback_url

    if (callbackUrl) {
      const callbackResponseData = {
        message_id: req.body.smsc_id,
        status: req.body.stat,
        status_code: 200,
        done_date: req.body.done_date,
        reference: req.body.sub,
        destination_addr: req.body.msisdn,
        dlvrd:req.body.dlvrd

        // length: req.body.length,
        // page: req.body.page,
        // cost: req.body.cost
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
