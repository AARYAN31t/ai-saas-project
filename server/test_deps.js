const pdfParse = require('pdf-parse');
const nodemailer = require('nodemailer');

console.log('Type of pdfParse:', typeof pdfParse);
console.log('Is pdfParse a function?', typeof pdfParse === 'function');
console.log('pdfParse keys:', Object.keys(pdfParse));

try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'test', pass: 'test' }
    });
    console.log('Nodemailer transporter created successfully');
} catch (e) {
    console.error('Nodemailer error:', e);
}
