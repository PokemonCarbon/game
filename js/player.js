/**
 */
//
"use strict";
//
import { geometry, pipe_async } from "./imports.js";
import { Direction } from "./util.js";
import * as Region from "./region.js";

//
export class Player {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = () => {
    return new Player({
        name: "Meghan",
        gender: null,
        imgs: [null,null,null],
        map: null,
        pos: new geometry.Point(0,0),
        direction: Direction.Down
    });
};
export const setMap = (reg, mapID) => async (player) => {
    player.map = await pipe_async(reg, Region.get("maps")(mapID));
    return player;
};
export const setPos = (x, y) => (player) => {
    player.pos.x = x;
    player.pos.y = y;
    return player;
};
