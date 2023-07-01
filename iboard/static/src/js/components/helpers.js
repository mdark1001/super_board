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
