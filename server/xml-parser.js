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
    },
    renderCombo: (jsonRows) => {
        var arr = [];
        for(var i in jsonRows) {
            var iRow = jsonRows[i];
            if(i == 0) {
                arr.push({
                    '@': { value: iRow.VALUE, selected: true },
                    '#': iRow.TEXT
                });
            }
            else {
                arr.push({
                    '@': { value: iRow.VALUE },
                    '#': iRow.TEXT
                });
            }
        }
        return o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            complete: {
                option: arr
            }
        });
    },
        renderFormCombo: (jsonRows) => {
        var arr = [];
        for(var i in jsonRows) {
            var iRow = jsonRows[i];
            if(i == 0) {
                arr.push({
                    '@': { value: iRow.VALUE, selected: true,label : iRow.TEXT }
                  //  '#': iRow.TEXT
                });
            }
            else {
                arr.push({
                    '@': { value: iRow.VALUE ,label : iRow.TEXT },
                   // '#': iRow.TEXT
                });
            }
        }
        return o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            data: {
                item: arr
            }
        });
    },
       renderSelect: (jsonRows,cod_first) => {
        var arr = [];
        for(var i in jsonRows) {
            var iRow = jsonRows[i];
            if(iRow.VALUE === cod_first) {
                arr.push({
                    '@': { value: iRow.VALUE, selected: true,label : iRow.LABEL },
                    
                });
            }
            else {
                arr.push({
                    '@': { value: iRow.VALUE,label : iRow.LABEL },
                  
                });
            }
        }
        return o2x({
            '?xml version="1.0" encoding="utf-8"?' : null,
            data: {
                item: arr
            }
        });
    }
};