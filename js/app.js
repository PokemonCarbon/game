/*
 * @author Nektro (Sean Denny)
 *
 * Pokémon Carbon
 *  - A moddable Pokémon game made in JS
 */
//
'use strict';
//
import * as a from "./util.js";
import * as Region from "./region.js";

//
const modsList = ['kanto'];

//
a.log(a.LogType.INFO, 'Test Info log.');
a.log(a.LogType.GOOD, 'Test Good log.');
a.log(a.LogType.WARN, 'Test Warn log.');
a.log(a.LogType.ERROR, 'Test Error log.');

//
Promise.all(modsList.map((v,i) => Region.build(v)))
.then(x => {
    a.log(a.LogType.GOOD, `Successfully loaded Regions: [${x.map(v => `'${v.name}'`)}]`);
    a.log(a.LogType.GOOD, `Starting game!`);
    a.log(a.LogType.INFO, `Starting in first Region: ${x[0].name}`);
    a.log(a.LogType.INFO, `Starting in first Map: ${x[0].maps[0]}`)
    console.log(x);
});
