/** @odoo-module **/

export function iboarColors(paletteColors) {
    const baseColor = [
        "#FBE7C6",
        "#B4F8C8",
        "#A0E7E5",
        "#FFAEBC",
        "#FBE7C6",
        "#B4F8C8",
        "#A0E7E5",
        "#FFAEBC",
    ];
    return (palette) => {
        return paletteColors[palette] || baseColor
    }
}

function iBoardFormatNumber(num, digits) {
    let si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "k"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "G"},
        {value: 1E12, symbol: "T"},
        {value: 1E15, symbol: "P"},
        {value: 1E18, symbol: "E"}
    ];
    let negative = false;
    if (num < 0) {
        num = Math.abs(num)
        negative = true
    }
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i = si.length - 1
    for (; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    if (negative) {
        return "-" + (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    } else {
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
}

export function iboardFormat(value, typeFormat = 'exact') {
    if (typeFormat === 'exact')
        return value
    else {
        return iBoardFormatNumber(value, 1)
    }
}