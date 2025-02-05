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
        sms_telebran: this.sendInfoTelebran.bind(this),
        sms_nsl: this.sendInfoNsl.bind(this)
      }
      const methodFunction = methods[methodName]
      if (typeof methodFunction === 'function') {
        try {
          const response = await methodFunction()
          await this.createLogs('sms')
          return response
        } catch (e) {
          throw new Error(e.message)
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
    payload.append(
      'callback_url',
      'https://gatewayapi.infonomics.ng/callback/hollatag'
    )
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
    payload.append(
      'callback_url',
      'https://gatewayapi.infonomics.ng/callback/hollatag'
    )
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

  async sendInfoNsl() {
    const general = this.setting;
    const url = 'https://app.9bits.net:2096/ng/v1/sendsms';
    const messageUuid = uuidv4();

    const payload = {
      from: this.from,
      to: this.toAddress,
      content: this.finalMessage,
      exec_time: '',
      delivery_report: true
    };

    const headers = {
      Authorization: `Bearer ${general.sms_nsl.api_token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(url, payload, { headers });
      console.log(response)
      this.messageUuid = messageUuid;
      this.response = response.data;
      
      if(response.data.status_code===200){
        return messageUuid;
      }else{
        throw new Error('Failed to send SMS via NSL');
      }
      
    } catch (error) {
      console.error(
        'Error sending SMS via NSL:',
        error.response ? error.response.data : error.message
      );
      throw new Error(error.response ? error.response.data : error.message);
    }
  }
}

module.exports = { Sms }
