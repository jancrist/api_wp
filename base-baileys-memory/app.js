const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const express = require('express');
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
const axios = require('axios');
const { delay } = require('@whiskeysockets/baileys');

const fs = require('fs');
// Cargar la lista desde el archivo JSON

const rawData = fs.readFileSync('blacklist.json', 'utf8');
const blacklistObj = JSON.parse(rawData);
const blacklist = blacklistObj.blacklist;


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    
    

    QRPortalWeb()
    app.post('/send-message-bot', async (req, res) => {
        try {
            const { message, phone } = req.body;

            if (!message || !phone) {
                return res.status(400).send({ error: 'Mensaje y número de teléfono son obligatorios en el cuerpo.' });
            }

            const formattedPhone = `${phone}@c.us`;

            await adapterProvider.sendText(formattedPhone, message);

            res.send({ data: 'Mensaje enviado correctamente.' });
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            res.status(500).send({ error: 'Error al enviar el mensaje.' });
        }
    });

    

    const PORT = 3500;
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));



}

main()