const { Sms } = require('../transactional/methods/sms')

class Notify {
  constructor (sendVia = null) {
    this.sendVia = sendVia
  }

  async send () {
    const methods = this.sendVia
      ? this.notifyMethods(this.sendVia)
      : this.notifyMethods()

    let results = []

    for (const Method of methods) {
      const notifyInstance = new Method()
      notifyInstance.templateName = this.templateName
      notifyInstance.shortCodes = this.shortCodes
      notifyInstance.from = this.from
      notifyInstance.user = this.user
      notifyInstance.createLog = this.createLog
      notifyInstance.service = this.service
      notifyInstance.callback = this.callback

      const result = await notifyInstance.send()
      results.push(result)
    }

    return results
  }

  notifyMethods (sendVia = null) {
    const methods = {
      sms: Sms
    }
    if (sendVia && !methods[sendVia]) {
      throw new Error(`Notification method "${sendVia}" is not supported.`)
    }

    return sendVia ? [methods[sendVia]] : Object.values(methods)
  }
}

const notify = async (
  service,
  templateName,
  shortCodes = {},
  from,
  user,
  channel,
  createLog,
  callback
) => {
  try {
    const notification = new Notify(channel)
    notification.templateName = templateName
    notification.shortCodes = shortCodes
    notification.from = from
    notification.user = user
    notification.createLog = createLog
    notification.service = service
    notification.callback = callback
    const results = await notification.send()
    return results
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

module.exports = { notify }
