const inquirer = require('inquirer');
const https = require('https');
const axios = require('axios');

require('dotenv').config();

const header = {
    headers: {
        'Private-Token': process.env.TOKEN_GITLAB
    }
};

// removendo certificado SSL
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const prompt = inquirer.createPromptModule();
const excelManager = require('./excel-manage');
const enviarEmail = require('./email-manage');

async function calcularTempo(data) {
    let total = 0;

    data.forEach((d) => {
        total += d.time_stats.total_time_spent;
    });

    return total;
}

async function converterSegundosParaHoras(segundos) {
    const horas = Math.floor(segundos / 3600);

    return horas;
}

async function getDados(path) {
    const dados = await axiosInstance
        .get(process.env.PATH_BASE + path + process.env.PATH_PAGINATION, header)
        .then((response) => response.data);

    let tempoTotal = await calcularTempo(dados);

    tempoTotal = await converterSegundosParaHoras(tempoTotal);

    return tempoTotal;
}

prompt([
    {
        type: 'input',
        name: 'milestone',
        message: 'Qual a milestone deseja exportar?'
    }
]).then(async (respostas) => {
    const totalDesenvDesc = `${respostas.milestone}-desenv`;
    const totalQADesc = `${respostas.milestone}-qa`;
    const totalReworkDesc = `${respostas.milestone}-rework`;

    console.log('\nExtraindo informações do Gitlab...');

    const totalTimeDesenv = await getDados(process.env.PATH_ISSUES_MILESTONE + totalDesenvDesc);
    const totalTimeQA = await getDados(process.env.PATH_MR_MILESTONE + totalQADesc);
    const totalTimeRework = await getDados(process.env.PATH_ISSUES_MILESTONE + totalReworkDesc);
    const totalGeral = totalTimeDesenv + totalTimeQA + totalTimeRework;

    const repostaMocha = {
        sprint: respostas.milestone,
        Milestones: [
            {
                title: 'Desenvolvimento',
                value: totalTimeDesenv
            },
            {
                title: 'Testes',
                value: totalTimeQA
            },
            {
                title: 'Retrabalho',
                value: totalTimeRework
            },
            {
                title: 'Total',
                value: totalGeral
            }
        ]
    };

    console.log('Informações extraídas.');

    await excelManager(repostaMocha);

    const mensagemConsole = {
        desenvolvimento: `Total de tempo gasto com Desenvolvimento: ${totalTimeDesenv}h.`,
        testes: `Total de tempo gasto com Testes: ${totalTimeQA}h.`,
        retrabalho: `Total de tempo gasto com Retrabalho: ${totalTimeRework}h.`,
        geral: `Total Geral: ${totalGeral}h`
    };

    const mensagemFormatada = `\n${mensagemConsole.desenvolvimento}\n${mensagemConsole.testes}\n${mensagemConsole.retrabalho}\n${mensagemConsole.geral}`;

    console.log(mensagemFormatada);

    await enviarEmail(mensagemFormatada, respostas.milestone);
});


const mailjet = require ('node-mailjet')
.connect('', '')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "rodrigodanielgoncalves@gmail.com",
        "Name": "Rodrigo"
      },
      "To": [
        {
          "Email": "rodrigodanielgoncalves@gmail.com",
          "Name": "Rodrigo"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
