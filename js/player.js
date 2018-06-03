/**
 */
//
"use strict";
//
import { geometry, pipe_async, isKeyDown, Keys, pipe } from "./imports.js";
import { Direction, WIDTH, HEIGHT, pen } from "./util.js";
import * as Region from "./region.js";
import * as Mapp from "./map.js";

//
geometry.Point.prototype.sum = function sum() {
    return this.x + this.y;
};

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
        direction: Direction.Down,
        pos: new geometry.Point(0,0,0),
        vel: new geometry.Point(0,0)
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
export const update = (player) => {
    if (isKeyDown(Keys.ArrowRight)) if (pipe(player.map, Mapp.isZoneWalkable(player.pos.x + 1, player.pos.y))) if (player.direction === Direction.Right) if (player.vel.sum() === 0) player.vel.x =  20;
    if (isKeyDown(Keys.ArrowDown))  if (pipe(player.map, Mapp.isZoneWalkable(player.pos.x, player.pos.y + 1))) if (player.direction === Direction.Down)  if (player.vel.sum() === 0) player.vel.y =  20;
    if (isKeyDown(Keys.ArrowLeft))  if (pipe(player.map, Mapp.isZoneWalkable(player.pos.x - 1, player.pos.y))) if (player.direction === Direction.Left)  if (player.vel.sum() === 0) player.vel.x = -20;
    if (isKeyDown(Keys.ArrowUp))    if (pipe(player.map, Mapp.isZoneWalkable(player.pos.x, player.pos.y - 1))) if (player.direction === Direction.Up)    if (player.vel.sum() === 0) player.vel.y = -20;
    //
    if (player.vel.x !== 0) {
        if (player.vel.x % 2 === 0)       player.pos.x += .1 * Math.sign(player.vel.x);
        if (Math.abs(player.vel.x) === 1) player.pos.x = Math.round(player.pos.x);
    }
    if (player.vel.y !== 0) {
        if (player.vel.y % 2 === 0)       player.pos.y += .1 * Math.sign(player.vel.y);
        if (Math.abs(player.vel.y) === 1) player.pos.y = Math.round(player.pos.y);
    }
    //
    player.vel.sub(new geometry.Point(...player.vel.spread().map(v => Math.sign(v))));
};
export const draw = (player) => {
    let x = WIDTH / 2 - 16;
    let y = HEIGHT / 2 - 16;
    pen.drawRect(x, y, 32, 32, "fill", "blue");
};
