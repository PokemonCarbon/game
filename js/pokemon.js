/**
 */
//
'use strict';
//
import * as a from "./util.js";

//
export class Pokemon {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = async (reg, id) => {
    a.log(a.LogType.INFO, `Creating Pokemon: ${reg}:${id}`);
    const p = new Pokemon();
    const _1 = await fetch(`../${reg}/pokemon/${id}/pokemon.ini`).then(x => x.text());
    const _2 = _1.split('\n').map(v => v.split('='));
    const _3 = _2.reduce((ac,cv) => (cv.length === 1) ? (ac) : (a.assign(ac, ...cv)), {});
    Object.assign(p, _3);
    return p;
}
