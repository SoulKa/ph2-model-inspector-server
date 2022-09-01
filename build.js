const { compile } = require("nexe");

compile({
    name: "PH2 Model Inspector",
    input: "./build/index.js",
    ico: "./favicon.ico",
    build: true,
    verbose: true,
    rc: {
        CompanyName: "SoulKa",
        ProductName: "PH2 Model Inspector",
        FileDescription: "A FBX model browser and PH2 map manager",
        LegalCopyright: "SoulKa under MIT license"
    }
}).then( () => console.log("Compilation done!") ).catch(console.error);