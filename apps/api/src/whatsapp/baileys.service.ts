import { Boom } from '@hapi/boom';
import path from 'path';

export class WhatsAppService {
  private sock: any;
  private isInit = false;

  async initEngine() {
    if (this.isInit) return;
    this.isInit = true;
    try {
      const baileys = await new Function('return import("@whiskeysockets/baileys")')();
      const makeWASocket = baileys.default?.default || baileys.default || baileys.makeWASocket;
      const { useMultiFileAuthState, DisconnectReason } = baileys;

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
            this.isInit = false;
            this.initEngine().catch(e => console.error("Erro no WhatsApp Engine:", e)); 
          } else {
            console.log('❌ WhatsApp Desconectado (Logout). Limpe as sessions.');
          }
        } else if (connection === 'open') {
          console.log('✅ API Central do Zap Online');
        }
      });

      this.sock.ev.on('creds.update', saveCreds);
    } catch(err) {
      console.error("Erro crítico no WhatsAppService:", err);
      this.isInit = false;
    }
  }

  async sendText(phoneId: string, message: string) {
    if (!this.sock) throw new Error("Motor não iniciado.");
    await this.sock.sendMessage(`${phoneId.replace(/\\D/g, '')}@s.whatsapp.net`, { text: message });
  }
}

export const waService = new WhatsAppService();
