/**
 */
//
"use strict";
//
import { pipe } from "./imports.js";
import { log, LogType, ffetch, parse_ini, arraybuffer_to_image, arraybuffer_to_audio, pen, options } from "./util.js";
import * as Player from "./player.js";
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
    const mpi = pipe(await ffetch(`../${reg}/maps/${id}/map.txt`, "text"), parse_ini);
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
        song: null
    });
};
export const load = (reg) => async (map) => {
    log(LogType.INFO, `Loading Map: ${reg.id}:${map.id}`);
    const r_walk = ffetch(`../${reg.id}/maps/${map.id}/walk.png`, "arrayBuffer");
    const r_teleport = ffetch(`../${reg.id}/maps/${map.id}/teleport.txt`, "text");
    const r_bgm = ffetch(`../${reg.id}/maps/${map.id}/${map.bgm}`, "arrayBuffer");
    const r_layers = ffetch(`../${reg.id}/maps/${map.id}/layers.json`, "json");
    return await Promise.resolve([r_walk, r_teleport, r_bgm, r_layers])
    .then(x => Promise.all(x))
    .then(x => {
        const [walk, teleport, bgm, layers] = x;
        return Promise.all([
            pipe(walk, arraybuffer_to_image(map.width, map.height)),
            teleport,
            pipe(bgm, arraybuffer_to_audio),
            pipe(layers, MappLayer.build(reg,map))
        ]);
    })
    .then(x => {
        const [walk, teleport, bgm, layers] = x;
        map.walk = walk;
        map.walk_con = map.walk.getContext("2d"),
        map.teleport = teleport;
        map.song = bgm;
        map.layers = layers;
        return Promise.resolve(map);
    });
};
export const isZoneWalkable = (x,y) => (map) => {
    if (x < 0 || x >= map.width) return false;
    if (y < 0 || y >= map.height) return false;
    return map.walk_con.getImageData(x,y,1,1).data[0] !== 0;
};
export const draw = (player) => (map) => {
    let mx = MappLayer.map_x - ((player.pos.x * 32)|0);
    let my = MappLayer.map_y - ((player.pos.y * 32)|0);

    for (let i = 0; i < map.layers.length; i++) {
        pipe(map.layers[i], MappLayer.draw(mx, my));
        //
        if (i === player.pos.z) {
            pipe(player, Player.draw);
        }
    }
    if (options.debug) {
        for (let i = 0; i < map.height; i++) {
            for (let j = 0; j < map.width; j++) {
                if (!(pipe(map, isZoneWalkable(j, i)))) {
                    pen.drawRect(mx + j * 32, my + i * 32, 32, 32, "fill", "red", 0.5);
                }
            }
        }
    }
};
