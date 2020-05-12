const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();
const excelManager = require('./excel-manage');

prompt([
    {
        type: 'input',
        name: 'milestone',
        message: 'Qual a milestone deseja exportar?'
    }
]).then((respotas) => {
    console.log(respotas);

    const repostaMocha = {
        sprint: respotas.milestone,
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
});
