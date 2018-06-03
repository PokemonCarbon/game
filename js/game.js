/**
 */
//
"use strict";
//
import { addKeyDownListener, Keys, pipe } from "./imports.js";
import { WIDTH, HEIGHT, pen, Direction, options } from "./util.js";
import * as Player from "./player.js";
import * as Mapp from "./map.js";

//
export class Game {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
        addKeyDownListener((e) => {
            if (e.code === Keys.ArrowUp)         this.player.direction = Direction.Up;
            if (e.code === Keys.ArrowRight)      this.player.direction = Direction.Right;
            if (e.code === Keys.ArrowDown)       this.player.direction = Direction.Down;
            if (e.code === Keys.ArrowLeft)       this.player.direction = Direction.Left;
            if (e.code === Keys.F9 && e.ctrlKey) options.debug = !options.debug;
        });
    }
}
export const build = (player) => {
    return new Game({
        player
    });
};
export const draw = (game) => {
    pen.clear();
    pipe(game, update);
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
export const update = (game) => {
    pipe(game.player, Player.update);
};
