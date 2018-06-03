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
};
