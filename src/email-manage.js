const nodemailer = require('nodemailer');

require('dotenv').config();

module.exports = async function enviarEmail(conteudo, sprint) {
    const remetente = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: '',
        secure: true,
        auth: {
            user: process.env.EMAIL_REMETENTE,
            pass: process.env.PASS_EMAIL_REMETENTE
        }
    });

    const emailToSend = {
        from: process.env.EMAIL_REMETENTE,
        to: process.env.EMAIL_DESTINATARIO,
        subject: 'Relatorio de Tempo Gasto: ',
        text: '',
        attachments: [
            {
                path: ''
            }
        ]
    };

    const mensagemEmail = {
        saudacao: 'Olá.\n\nSeguem as informações de tempo gasto da sprint em questão:\n\n',
        despedida: '\n\nTambém segue, em anexo, um arquivo xlsx contendo essas mesmas informações.\n\nAtenciosamente.'
    };

    const mensagemEmailFormatada = `${mensagemEmail.saudacao}${conteudo}${mensagemEmail.despedida}`;

    emailToSend.text = mensagemEmailFormatada;
    emailToSend.subject = `${emailToSend.subject}${sprint}`;
    emailToSend.attachments[0].path = `../${sprint}.xlsx`;

    console.log('\nEnviando email...');

    remetente.sendMail(emailToSend, (error) => {
        if (error) {
            console.log(error);
        } else {
            const msg = `Email enviado para: ${process.env.EMAIL_DESTINATARIO}`;
            console.log(msg);
        }
    });
};
