const smpp = require('smpp')
const { v4: uuidv4 } = require('uuid')
const { Sms } = require('../../transactional/methods/sms')
const { notify } = require('../../transactional')

function startSMPPServer (port = 2775) {
  const smppServer = smpp.createServer(session => {
    console.log('SMPP Client connected')

    session.on('bind_transceiver', pdu => {
      if (
        pdu.system_id === 'Infonomics' &&
        pdu.password === 'ThisIsurPasswordDonotLoseIt'
      ) {
        session.send(pdu.response())
      } else {
        session.send(pdu.response({ command_status: smpp.ESME_RBINDFAIL }))
      }
    })

    session.on('submit_sm', async pdu => {
      const sender = pdu.source_addr.toString()
      const recipient = pdu.destination_addr.toString()
      const message = pdu.short_message.message

      try {
        const response = await notify(
          'sms_telebran',
          'OTP',
          { OTP: message },
          sender,
          recipient,
          ['sms'],
          true
        )

        const responseString = response[0]

        const [receiverNumber, messageUUID] = responseString.split(',')

        if (receiverNumber && messageUUID) {
          const successMessage = `Message successfully sent to ${receiverNumber} (UUID: ${messageUUID}).`
          console.log(successMessage)
          session.send(
            pdu.response({
              message_id: messageUUID,
              short_message: successMessage,
              command_status: smpp.ESME_ROK
            })
          )
        } else {
          const errorMessage =
            'Error: Unable to retrieve the receiver number or message UUID.'
          console.error(errorMessage)
          session.send(
            pdu.response({
              command_status: smpp.ESME_RSYSERR,
              short_message: errorMessage
            })
          )
        }
      } catch (error) {
        console.error('Error processing submit_sm:', error)
        session.send(
          pdu.response({
            command_status: smpp.ESME_RSYSERR
          })
        )
      }
    })

    session.on('unbind', pdu => {
      session.send(pdu.response())
      console.log('SMPP Client unbound')
      session.close()
    })

    session.on('error', error => {
      console.error('SMPP session error:', error)
    })
  })

  smppServer.listen(port, () => {
    console.log(`SMPP server is listening on port ${port}`)
  })
}

module.exports = { startSMPPServer }
