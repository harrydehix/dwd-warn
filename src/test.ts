import dwd from "./warnings";

async function main() {
    const warnings = await dwd.fetchWarnings();
    console.log(warnings.filterByRegionName("Kreis Bad Kreuznach"));
}

main();
