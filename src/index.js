const inquirer = require('inquirer');
// const excel = require('node-excel-export');
const fs = require('fs');



const prompt = inquirer.createPromptModule();

prompt([
    {
        type: 'input',
        name: 'milestone',
        message: 'Qual a milestone deseja exportar?'
    }
]).then((respotas) => {
    console.log(respotas);

    let repostaMocha = {
        sprint: 'Sprint 1',
        IssuesQd: 3,
        Issues:{
            Issue1:{
                title:'Resolver problemas de Layout da tela brbc389',
                id: 1,
                estimated: '2hrs'
            },
            Issue2:{
                title:'Resolver problemas de Layout da tela brbc389',
                id: 1,
                estimated: '2hrs'
            },

        }
    };

    fs.appendFile(`${repostaMocha.sprint}.xls`, 'data to append', (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
      });
});

