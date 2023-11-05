# dwd-warn

Unofficial api for official DWD warnings. Uses the official _JSONP_ warn file which is located [here](https://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json). Warnings are always up to date with a maximum delay of 10 minutes. Learn more [here](https://www.dwd.de/DE/wetter/warnungen_aktuell/objekt_einbindung/objekteinbindung.html).

# Starter guide

### 1. Install the package

Install this package with npm:

```batch
npm install dwd-warn
```

### 2. Import the package

Inside your nodejs script import the package:

```ts
const dwd = require("dwd-warn").default;
// or
import dwd from "dwd-warn";
```

### 3. Fetch the warnings!

Fetch the current warnings. This code is asynchronous, it uses _Promises_, an asynchronous wrapper function is recommended.

```ts
async main(){
    const warnings = await dwd.fetchWarnings();
    const ahrweiler_warnings = warnings.filterByRegionName("Kreis Ahrweiler");

    if(ahrweiler_warnings){
        console.log(ahrweiler_warnings);
    }else{
        console.log("No warnings available!");
    }
}

main();
```

# Community

This project is updated on demand. If you have a question, found a bug or similar feel free to ask [here]().
