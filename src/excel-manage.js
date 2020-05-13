const Excel = require('exceljs');

module.exports = async function excelManager(repostaMocha) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(`Sprint ${repostaMocha.sprint}`);
    console.log(repostaMocha.sprint);

    worksheet.columns = [
        { header: `Sprint ${repostaMocha.sprint}` },
        { header: 'Issue', key: 'id', width: 10 },
        { header: 'Title', key: 'title', width: 90 },
        { header: 'Estimated', key: 'estimated', width: 15 },
        { header: 'Spent', key: 'spent', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Labels', key: 'labels', width: 45 },
        { header: 'Author', key: 'author', width: 35 }

    ];

    repostaMocha.Issues.forEach((element) => {
        console.log(element);
        worksheet.addRow(
            {
                id: element.id,
                title: element.title,
                estimated: element.estimated,
                spent: element.spent,
                status: element.status,
                labels: element.labels,
                author: element.author
            }
        );
    });
    await workbook.xlsx.writeFile(`Sprint-${repostaMocha.sprint}.xlsx`);
    console.log('File is written');
};
