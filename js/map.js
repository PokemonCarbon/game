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
export const load = (reg) => async (map) => {
    const r_walk = a._fetch(`../${reg.id}/maps/${map.id}/walk.png`);
    const r_teleport = a._fetch(`../${reg.id}/maps/${map.id}/teleport.txt`);
    const r_bgm = a._fetch(`../${reg.id}/maps/${map.id}/${map.bgm}`);
    const r_layers = new Array(map.layers).fill(0).map((x,i) => a._fetch(`../${reg.id}/maps/${map.id}/layer-${i}.json`));
    return await Promise.resolve([r_walk, r_teleport, r_bgm, ...r_layers])
    .then(x => Promise.all(x))
    .then(x => {
        const [walk, teleport, bgm, ...layers] = x;
        return Promise.all([
            walk.arrayBuffer(),
            teleport.text(),
            bgm.arrayBuffer(),
            ...layers.map(v => v.json())
        ]);
    })
    .then(x => {
        const [walk, teleport, bgm, ...layers] = x;
        return Promise.all([
            a.pipe(walk, a.arraybuffer_to_image(map.width, map.height)),
            teleport,
            a.pipe(bgm, a.arraybuffer_to_audio),
            ...layers.map(y => MappLayer.build(reg,map)(y))
        ]);
    })
    .then(x => {
        const [walk, teleport, bgm, ...layers] = x;
        return Promise.resolve({ walk, teleport, bgm, layers });
    });
}
