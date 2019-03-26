const fs = require('fs');
const rimraf = require('rimraf');
const flowPath = process.argv[2];
const flow = JSON.parse(fs.readFileSync(flowPath, 'utf8'))
    .map((node, i) => {
        node.position = i;
        return node;
    });
const nodeTypes = [...new Set(flow.map(obj => obj.type.replace(/\s|:/g, '-')))];

rimraf('./flow', (err) => {
    if (err) {
        console.log(err);
        return;
    }
    parseNodeRedJSON();
    // fs.unlinkSync(flowPath);
});


function parseNodeRedJSON() {
    fs.mkdirSync('./flow');
    
    for (const type of nodeTypes) {
        const nodes = flow.filter(obj => obj.type.replace(/\s|:/g, '-') === type);

        fs.mkdirSync(`./flow/${type}`);

        for (const node of nodes) {
            console.log(node);
            if (node.type === 'function') {
                fs.writeFileSync(`./flow/${type}/${node.id}.js`, node.func);
                delete node.func;
            }            
            fs.writeFileSync(`./flow/${type}/${node.id}.json`, JSON.stringify(node, null, 4));
        }
    }
}