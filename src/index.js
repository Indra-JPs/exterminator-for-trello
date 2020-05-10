const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

prompt([
    {
        type: 'input',
        name: 'milestone',
        message: 'Qual a milestone deseja exportar?'
    }
]).then(respotas => {
    console.log(respotas);
})