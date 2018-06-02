/**
 */
//
"use strict";
//
import { pipe } from "./imports.js";
import { log, LogType, ffetch, parse_ini } from "./util.js";

//
export class Pokemon {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = async (reg, id) => {
    log(LogType.INFO, `Creating Pokemon: ${reg}:${id}`);
    const pki = await ffetch(`../${reg}/pokemon/${id}/pokemon.ini`, "text");
    return new Pokemon(pipe(pki, parse_ini));
};
