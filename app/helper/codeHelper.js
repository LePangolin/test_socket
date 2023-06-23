function generateCode() {
    const LETTER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += LETTER.charAt(Math.floor(Math.random() * LETTER.length));
    }   
    return code;
}

module.exports = {
    generateCode
}