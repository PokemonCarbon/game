/**
 */
//
'use strict';
//
import * as a from "./util.js";

//
export class Mapp {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
        this.walk = [];
        this.teleport = [];
        this.layers = [];
    }
}
export const build = async (reg, id) => {
    a.log(a.LogType.INFO, `Creating Map: ${reg}:${id}`);
    const mpi = a.pipe(await a.ffetch(`../${reg}/maps/${id}/map.txt`, 'text'), a.parse_ini);
    const { width, height, layers, bgm, map_bottom, map_top, map_left, map_right } = mpi;
    return new Mapp({
        id,
        width: a.pipe(width || 1, parseInt),
        height: a.pipe(height || 1, parseInt),
        layers: a.pipe(layers || 1, parseInt),
        bgm,
        map_top,
        map_bottom,
        map_left,
        map_right
    });
}
