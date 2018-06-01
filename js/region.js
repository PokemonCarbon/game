/**
 */
//
"use strict";
//
import * as a from "./util.js";
import * as Pokemon from "./pokemon.js";
import * as Type from "./type.js";
import * as Mapp from "./map.js";
import * as Structure from "./structure.js";

//
export class Region {
    constructor(args) {
        for (const o in args) {
            this[o] = args[o];
        }
    }
}
export const build = async (id) => {
    a.log(a.LogType.INFO, `Creating Region: ${id}`);
    const manifest = await fetch(`../${id}/manifest.json`).then(x => x.json());
    const { api_version, name, version } = manifest;
    const reg = new Map();
    const types = new Map();
    const pokemon = new Map();
    const structures = new Map();
    const maps = new Map();

    if (manifest.types !== undefined) {
        for (const t in manifest.types) {
            a.log(a.LogType.INFO, `Creating Type: ${id}:${t}`);
            const [ name, weakness, resistance, immunity, special ] = manifest.types[t];
            types.set(t, new Type.Type({
                name,
                weakness: weakness || [],
                resistance: resistance || [],
                immunity: immunity || [],
                special: special || false
            }));
        }
    }
    if (manifest.pokemon !== undefined) {
        const pk_ar = await Promise.all(manifest.pokemon.map(v => Pokemon.build(id, v)));
        for (const p of pk_ar) {
            pokemon.set(p.InternalName.toLowerCase(), p);
        }
    }
    if (manifest.maps !== undefined) {
        const mp_ar = await Promise.all(manifest.maps.map(x => Mapp.build(id, x)));
        for (const mp of mp_ar) {
            maps.set(mp.id, mp);
        }
    }

    reg.set("types", types);
    reg.set("pokemon", pokemon);
    reg.set("structures", structures);
    reg.set("maps", maps);
    registry_regions.set(id, reg);

    const r = new Region({
        id,
        name: manifest.name,
        api_version: manifest.api_version,
        pokemon: manifest.pokemon || [],
        structures: manifest.structures || [],
        maps: manifest.maps || []
    });
    return r;
};
export function get(type) {
    const R = {
        pokemon: Pokemon,
        structures: Structure,
        maps: Mapp
    };
    return function(id, raw=false) {
        return async function(reg) {
            if (reg[type].includes(id) || raw) {
                const p = `${reg.id}:${id}`;
                if (a[type].has(p)) {
                    return a[type].get(p);
                }
                else {
                    const t = a.regions.get(reg.id).get(type).get(id);
                    const l = a.pipe(raw ? id : t, R[type].load(reg))
                    a[type].set(p, l);
                    return l;
                }
            }
            else {
                return Promise.reject(`${reg.name} does not include ${type} ${id}`);
            }
        };
    };
}
