/**
 */
//
'use strict';
//
import * as a from "./util.js";
import * as Pokemon from "./pokemon.js";

//
export class Region {
    constructor() {
        //
    }
}
export const build = async (id) => {
    a.log(a.LogType.INFO, `Creating Region: ${id}`);
    const r = new Region();
    Object.assign(r, await fetch(`../${id}/manifest.json`).then(x => x.json()));
    if (r.pokemon !== undefined) {
        r.pokemon_data = await Promise.all(r.pokemon.map(v => Pokemon.build(id, v)));
    }
    return r;
}
