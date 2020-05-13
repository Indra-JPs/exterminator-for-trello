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
    const dados = await axiosInstance.get(process.env.PATH_BASE + path, header)
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
    console.log(respostas);

    const repostaMocha = {
        sprint: respostas.milestone,
        IssuesQd: 3,
        Issues: [
            {
                title: 'Resolver problemas de Layout da tela brbc389',
                id: 1,
                estimated: '24hrs',
                spent: '15hrs',
                status: 'staging',
                author: 'Rodrigo Gonçalves',
                labels: 'staging, Review, Rework'
            },
            {
                title: 'Resolver problemas de Layout e de fluxo da tela brpe937',
                id: 2,
                estimated: '8hrs',
                spent: '7hrs',
                status: 'Review',
                author: 'Paulo',
                labels: 'Review, Rework'
            },
            {
                title: 'Resolver problemas de Layout e de fluxo da tela brpe459',
                id: 3,
                estimated: '16hrs',
                spent: '15hrs',
                status: 'doing',
                author: 'Cobol',
                labels: 'doing, Rework'
            }
        ]
    };

    excelManager(repostaMocha);

    const totalTime = await getDados(process.env.PATH_ISSUES_MILESTONE + respostas.milestone);

    console.log(`Total de tempo gasto com a ${respostas.milestone}: ${totalTime}h.`);
});
