/**
 */
//
'use strict';
//
import * as a from "./util.js";

//
export class Pokemon {
    constructor() {
        //
    }
}
export const build = async (reg, id) => {
    a.log(a.LogType.INFO, `Creating Pokemon: ${reg}:${id}`);
    const p = new Pokemon();
    const _1 = await fetch(`../${reg}/pokemon/${id}/pokemon.ini`).then(x => x.text());
    const _3 = _1.split('\n').map(v => v.split('='));
    const _5 = _3.reduce((ac,cv) => (cv.length === 1) ? (ac) : (a.assign(ac, ...cv)), {});
    Object.assign(p, _5);
    return p;
}
