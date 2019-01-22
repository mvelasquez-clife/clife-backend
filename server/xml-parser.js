const o2x = require('object-to-xml');

module.exports = {
    renderXml: (jsonRows) => {
        var arr = [];
        for(var i in jsonRows) {
            var iRow = jsonRows[i];
            var vCell = [];
            for(var key in iRow) vCell.push(iRow[key]);
            arr.push({
                '@': { id: jsonRows[i].ID ? jsonRows[i].ID : i },
                cell: vCell
            });
        }
        return o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            rows: {
                row: arr
            }
        });
    }
};