/**
 */
//
'use strict';
//
import { log, LogType, pipe, ffetch, parse_ini, arraybuffer_to_image, arraybuffer_to_audio, _fetch } from "./util.js";
import * as MappLayer from "./maplayer.js";

//
export class Mapp {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = async (reg, id) => {
    log(LogType.INFO, `Creating Map: ${reg}:${id}`);
    const mpi = pipe(await ffetch(`../${reg}/maps/${id}/map.txt`, 'text'), parse_ini);
    const { width, height, layers, bgm, map_bottom, map_top, map_left, map_right } = mpi;
    return new Mapp({
        id,
        width: pipe(width || 1, parseInt),
        height: pipe(height || 1, parseInt),
        layers: pipe(layers || 1, parseInt),
        bgm,
        map_top,
        map_bottom,
        map_left,
        map_right,
        walk: null,
        teleport: null,
        song: null,
        layers: null
    });
}
export const load = (reg) => async (map) => {
    const r_walk = ffetch(`../${reg.id}/maps/${map.id}/walk.png`, 'arrayBuffer');
    const r_teleport = ffetch(`../${reg.id}/maps/${map.id}/teleport.txt`, 'text');
    const r_bgm = ffetch(`../${reg.id}/maps/${map.id}/${map.bgm}`, 'arrayBuffer');
    const r_layers = new Array(map.layers).fill(0).map((x,i) => ffetch(`../${reg.id}/maps/${map.id}/layer-${i}.json`, 'json'));
    return await Promise.resolve([r_walk, r_teleport, r_bgm, ...r_layers])
    .then(x => Promise.all(x))
    .then(x => {
        const [walk, teleport, bgm, ...layers] = x;
        return Promise.all([
            pipe(walk, arraybuffer_to_image(map.width, map.height)),
            teleport,
            pipe(bgm, arraybuffer_to_audio),
            ...layers.map(y => MappLayer.build(reg,map)(y))
        ]);
    })
    .then(x => {
        const [walk, teleport, bgm, ...layers] = x;
        map.walk = walk;
        map.teleport = teleport;
        map.song = bgm;
        map.layers = layers;
        return Promise.resolve(map);
    });
}
