const pdfParse = require('pdf-parse');
console.log('pdfParse full object:', pdfParse);
try {
    console.log('pdfParse.default:', pdfParse.default);
} catch (e) { }

const nodemailer = require('nodemailer');
console.log('Nodemailer:', nodemailer);
