export function formatPhone(phone: string | undefined | null): string {
    if (!phone) return '';
    let digits = String(phone).replace(/\D/g, '');
    
    if (digits.startsWith('0') && (digits.length === 11 || digits.length === 12)) {
         digits = digits.substring(1);
    }

    if (digits.length === 10 || digits.length === 11) {
         digits = '55' + digits;
    }
    
    return digits;
}
