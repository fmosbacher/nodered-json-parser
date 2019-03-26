const fs = require('fs');
const parsedFlowPath = process.argv[2];
let separator = '';
let nodeRedJson = '[';

if (fs.existsSync('./flow.json')) {
    fs.unlinkSync('./flow.json');
}

for (const nodeType of fs.readdirSync(parsedFlowPath)) {
    for (const nodeFileName of fs.readdirSync(`${parsedFlowPath}/${nodeType}`)) {
        if (nodeFileName.includes('.json')) {
            const jsonFile = `${parsedFlowPath}/${nodeType}/${nodeFileName}`;
            let json = '';

            if (nodeType === 'function') {
                const jsFile = jsonFile.replace('.json', '.js');
                const js = fs.readFileSync(jsFile, 'utf8');
                
                json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
                json.func = js;
                json = JSON.stringify(json);
            } else {
                json = fs.readFileSync(jsonFile, 'utf8');
            }
    
            nodeRedJson += separator + json;
            separator = ', ';
        }
    }
}

nodeRedJson += ']';

nodeRedJson = JSON.parse(nodeRedJson)
    .sort((a, b) => a.position - b.position)
    .map(node => {
        delete node.position;
        return node;
    });

fs.writeFileSync('./flow.json', JSON.stringify(nodeRedJson, null, 4));