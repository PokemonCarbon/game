/**
 */
//
"use strict";
//
import { pipe } from "./imports.js";
import { pen, WIDTH, HEIGHT } from "./util.js";
import { get } from "./region.js";

//
export const FLAG_FLIPPED_HORIZONTAL = 0x80000000;
export const FLAG_FLIPPED_VERTICAL   = 0x40000000;
export const FLAG_FLIPPED_DIAGONAL   = 0x20000000;
export const map_x = (WIDTH / 2) - 16;
export const map_y = (HEIGHT / 2) - 16;

//
export class MappLayer {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = (reg,map) => async (ml) => {
    const [ st, ly ] = ml;

    const tilesets = new Set();
    const structs = await Promise.all(st.map(x => pipe(reg, get("structures")(x, true))));
    structs.forEach(v => tilesets.add(v.tfgid));

    // TODO redo since callbacks mess up async/await code
    const layers = ly.map((x) => {
        return x.map((y,j) => {
            return y.map((z,k) => {
                if (z === 0) {
                    return 0;
                }
                const fh = parseInt(z & FLAG_FLIPPED_HORIZONTAL) != 0;
                const fd = parseInt(z & FLAG_FLIPPED_DIAGONAL)   != 0;
                const fv = parseInt(z & FLAG_FLIPPED_VERTICAL)   != 0;

                z &= ~(FLAG_FLIPPED_HORIZONTAL | FLAG_FLIPPED_VERTICAL | FLAG_FLIPPED_DIAGONAL);

                const temp = structs.filter(v => v.rid === z)[0];

                return {
                    x: k,
                    y: j,
                    img: temp.value
                };
            });
        });
    })
    .map(x => x.map(y => y.filter(z => z !== 0)))
    .map(x => x.filter(y => y.length > 0))
    .filter(x => x.length > 0)
    .reduce((ac,cv) => ac.concat(cv), [])
    .reduce((ac,cv) => ac.concat(cv), []);

    const width = map.width * 32;
    const height = map.height * 32;
    const can = document.createElement("canvas");
    can.setAttribute("width", width);
    can.setAttribute("height", height);
    const con = can.getContext("2d");

    for (const i of layers) {
        con.drawImage(i.img, i.x * 32, i.y * 32 - (((i.img.height / 32) - 1) * 32));
    }

    return new MappLayer({
        width,
        height,
        value: can
    });
};
