var fs = require("fs");

fs.readFile("../essentialmode/resources/[sawu]/sawu_mdt/__resource.lua", "utf8", function (err, data) {
    if (err) throw err;
    console.log(data);
});