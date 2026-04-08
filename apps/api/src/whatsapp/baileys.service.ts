import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';

export class WhatsAppService {
  private sock: any;

  async initEngine() {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, '..', '..', 'sessions'));

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: true, 
      browser: ['SaaS Cashback API', 'Chrome', '1.0']
    });

    this.sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'close') {
        const err = lastDisconnect?.error as Boom;
        if (err?.output?.statusCode !== DisconnectReason.loggedOut) {
          console.log('⚡ Conexão reestabelecendo...');
          this.initEngine(); 
        }
      } else if (connection === 'open') {
        console.log('✅ API Central do Zap Online');
      }
    });

    this.sock.ev.on('creds.update', saveCreds);
  }

  async sendText(phoneId: string, message: string) {
    if (!this.sock) throw new Error("Motor não iniciado.");
    await this.sock.sendMessage(`${phoneId.replace(/\D/g, '')}@s.whatsapp.net`, { text: message });
  }
}
