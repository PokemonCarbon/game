/**
 */
//
"use strict";
//

//
const map_x = (WIDTH / 2) - 16;
const map_y = (HEIGHT / 2) - 16;
import { addKeyDownListener, Keys, pipe } from "./imports.js";
import { WIDTH, HEIGHT, pen, Direction, options } from "./util.js";
import * as Mapp from "./map.js";

//
export class Game {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = (player) => {
    return new Game({
        player
    });
};
export const draw = (game) => {
    pen.clear();
    pen.drawRect(0, 0, WIDTH, HEIGHT, "fill", "black");
    pipe(game.player.map, Mapp.draw(game.player));
    //
    document.body.children[1].children[1].children[1].textContent = `
        player:
            dir: ${Object.keys(Direction)[Object.values(Direction).indexOf(game.player.direction)]}
            pos: ${game.player.pos.spread().slice(0,3).map(x => x.toFixed(1))}
            vel: ${game.player.vel.spread().slice(0,2)}
            walk: ${pipe(game.player.map, Mapp.isZoneWalkable(...game.player.pos.spread()))}
    `;
};
