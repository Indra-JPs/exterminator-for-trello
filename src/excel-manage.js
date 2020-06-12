const Excel = require('exceljs');

module.exports = async function excelManager(repostaMocha) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(`../${repostaMocha.sprint}`);

    worksheet.columns = [
        { header: 'Tempo gasto com', key: 'title', width: 90 },
        { header: 'Em Horas', key: 'value', width: 15 }
    ];

    repostaMocha.Milestones.forEach((element) => {
        worksheet.addRow(
            {
                title: element.title,
                value: element.value
            }
        );
    });

    console.log('\nExportando arquivo...');
    await workbook.xlsx.writeFile(`../${repostaMocha.sprint}.xlsx`);
    console.log('Arquivo XLS exportado.');
};
