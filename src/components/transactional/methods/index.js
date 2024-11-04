const fs = require('fs')
const DataAdapterInterface = require('../../../database/adapter')

class NotifyProcess {
  constructor () {}

  async init () {
    this.setting = JSON.parse(
      fs.readFileSync(
        '/home/infonomics/public_html/sms_node/json/settings.json'
      )
    )
    this.templates = JSON.parse(
      fs.readFileSync(
        '/home/infonomics/public_html/sms_node/json/templates.json'
      )
    )
  }

  async prevConfiguration () {
    if (this.user) {
      this.email = this.user
    }
    this.toAddress = this.email
  }

  async getMessage () {
    await this.prevConfiguration()
    const template = this.templates[this.templateName]
    const globalTemplate = this.templates.SMS_GTEMP
    if (!template || !globalTemplate) {
      return false
    }

    let message = ''

    if (this.user && template) {
      message = this.replaceShortCode(template.body, globalTemplate.body)
    }

    if (this.shortCodes) {
      for (const [code, value] of Object.entries(this.shortCodes)) {
        message = message.replace(`{{${code}}}`, value)
      }
    }

    if (!template && this.templateName) {
      return false
    }
    this.getSubject(template)

    this.finalMessage = message
    return message
  }

  replaceShortCode (body, template) {
    try {
      let message = template.replace('{{message}}', body)
      return message
    } catch (error) {
      throw new Error('Cannot replace text in email template')
    }
  }

  getSubject (template) {
    if (template) {
      let subject = template.subject
      if (this.shortCodes) {
        for (const [code, value] of Object.entries(this.shortCodes)) {
          subject = subject.replace(`{{${code}}}`, value)
        }
      }
      this.subject = subject
    }
  }

  async createLogs (type) {
    if (this.user) {
      const logData = {
        request_id: this.messageUuid,
        to_phone: this.toAddress,
        user: this.toAddress,
        from_sender: `${this.service} - ${this.from}`,
        callback_url: this.callback,
        msg:
          type === 'email'
            ? this.finalMessage
            : this.finalMessage.replace(/<[^>]*>/g, '')
      }
      const logResData = {
        request_id: this.messageUuid,
        to_phone: this.toAddress,
        from_sender: `${this.service} - ${this.from}`,
        response_code: this.response.status,
        response_message: this.response.data
      }

      const logAdapter = new DataAdapterInterface('sms_requests')
      const requiredFields = [
        'user',
        'request_id',
        'to_phone',
        'from_sender',
        'msg',
        'callback_url'
      ]
      const logResAdapter = new DataAdapterInterface('sms_responses')
      const requiredField = [
        'request_id',
        'to_phone',
        'from_sender',
        'response_code',
        'response_message'
      ]

      try {
        await logAdapter.create(logData, requiredFields)
        await logResAdapter.create(logResData, requiredField)
      } catch (error) {
        console.error('Error creating log:', error.message)
      }
    }
  }
}

module.exports = NotifyProcess
