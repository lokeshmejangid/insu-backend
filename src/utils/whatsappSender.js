const twilio = require('twilio');

// Twilio credentials
const accountSid = 'your_account_sid'; // Replace with your Twilio Account SID
const authToken = 'your_auth_token';   // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

// Send WhatsApp Message
async function sendWhatsAppMessage(to, message) {
    try {
        const response = await client.messages.create({
            from: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
            to: `whatsapp:${to}`,
            body: message,
        });
        console.log('WhatsApp message sent:', response.sid);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

module.exports = { sendWhatsAppMessage };
