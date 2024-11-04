const NotifyProcess = require('..')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

class Sms extends NotifyProcess {
  constructor () {
    super()
  }

  async send () {
    await this.init()
    const message = await this.getMessage()
    if (this.setting && message) {
      const methodName = this.service
      const methods = {
        sms_teleinfo: this.sendInfoTeleinfo.bind(this),
        sms_telebran: this.sendInfoTelebran.bind(this)
      }
      const methodFunction = methods[methodName]
      if (typeof methodFunction === 'function') {
        try {
          const response = await methodFunction()
          await this.createLogs('sms')
          return response
        } catch (e) {
          console.error('Mail error:', e.message)
        }
      }
    }
  }
  async sendInfoTeleinfo () {
    const general = this.setting
    const url = 'https://sms.hollatags.com/api/send/'
    const payload = new URLSearchParams()
    const messageUuid = uuidv4()

    payload.append('user', general.sms_teleinfo.username)
    payload.append('pass', general.sms_teleinfo.password)
    payload.append('from', this.from)
    payload.append('msg', this.finalMessage)
    payload.append('to', this.toAddress)
    payload.append('callback_url', 'https://url/')
    payload.append('enable_msg_id', 'TRUE')
    payload.append('message_uuid', messageUuid)
    payload.append('type', '0')

    try {
      const response = await axios.post(url, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      this.messageUuid = messageUuid
      this.response = response
      return response.data
    } catch (error) {
      console.error(
        'Error sending SMS:',
        error.response ? error.response.data : error.message
      )
      throw new Error('Failed to send SMS')
    }
  }
  async sendInfoTelebran () {
    const general = this.setting

    const url = 'https://sms.hollatags.com/api/send/'
    const payload = new URLSearchParams()
    const messageUuid = uuidv4()

    payload.append('user', general.sms_telebran.username)
    payload.append('pass', general.sms_telebran.password)
    payload.append('from', this.from)
    payload.append('msg', this.finalMessage)
    payload.append('to', this.toAddress)
    payload.append('callback_url', 'https://url/')
    payload.append('enable_msg_id', 'TRUE')
    payload.append('message_uuid', uuidv4())
    payload.append('type', '0')

    try {
      const response = await axios.post(url, payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      this.messageUuid = messageUuid
      this.response = response
      return response.data
    } catch (error) {
      console.error(
        'Error sending SMS:',
        error.response ? error.response.data : error.message
      )
      throw new Error('Failed to send SMS')
    }
  }
}

module.exports = { Sms }
