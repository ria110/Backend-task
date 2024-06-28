const axios = require('axios');
const fs = require('fs');

let pokemon = process.argv[2].toLowerCase();
let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

if (process.argv.length !== 3) {
  console.error("error: only 1 pokemon name is allowed");
  process.exit(1);
}

async function details(pokemon) {
  try {
    let res = await axios.get(url);
    let data = res.data;
    console.log(`Name : ${data.name}`);
    console.log(`National Number : ${data.id}`);
    console.log(`Height : ${data.height / 10} m`);
    console.log(`Weight : ${data.weight /10} kg`);
    console.log(`Type:`);
    data.types.forEach(type => {
      console.log(type.type.name);
    });
    console.log(`\nBase Stats:`);
    data.stats.forEach(stat => {
      console.log(`${stat.stat.name}: ${stat.base_stat}`);
    });
    console.log(`Abilities:`);
    data.abilities.forEach(ability => {
      console.log(ability.ability.name);
    });

    const spriteUrl = data.sprites.other['official-artwork'].front_default;
    await download(spriteUrl);

  } catch {
    console.log("error");
  }
}

async function download(url) {
  if (url) {
    try {
      const response = await axios({
        url: url,
        responseType: 'stream',
      });
      response.data.pipe(fs.createWriteStream("sprite.png"))
        .on('finish', () => console.log("\nsprite downloaded"))
        .on('error', (error) => console.error("error: unable to download", error));
    } catch (error) {
      console.error(`error: ${error.message}`);
    }
  } else {
    console.error("error: URL not found");
  }
}

details(pokemon);
