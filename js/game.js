/**
 */
//
"use strict";
//
import { WIDTH, HEIGHT, pen } from "./util.js";

//
const map_x = (WIDTH / 2) - 16;
const map_y = (HEIGHT / 2) - 16;

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

    for (const ml of game.player.map.layers) {
        let x = map_x - ((game.player.pos.x * 32)|0);
        let y = map_y - ((game.player.pos.y * 32)|0);
        pen.drawImage(ml.value, 0, 0, ml.width, ml.height, x, y, ml.width, ml.height, 0);
    }
};
