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
    const totalTime = await getDados(process.env.PATH_ISSUES_MILESTONE + respostas.milestone);

    console.log(`Total de tempo gasto com a ${respostas.milestone}: ${totalTime}h.`);
});
