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
    const pki = await a.ffetch(`../${reg}/pokemon/${id}/pokemon.ini`, 'text');
    return new Pokemon(a.pipe(pki, a.parse_ini));
}
