import {writeFile, readFile, rm, readdir} from "fs/promises"
import jsonStringify from 'json-stable-stringify'
import axios from "axios";
import _ from "lodash"

const main = async () => {
    // Reading repository and live dataset versions
    const [fileDataset, liveDataset] = await Promise.all([
        readFile("../registry-data/full.json")
            .then(data => JSON.parse(data)),
        axios.get("https://registry.api.identifiers.org/resolutionApi/getResolverDataset")
            .then(httpResponse => httpResponse.data)
            .then(json => json.payload.namespaces),
        ]).catch (err => console.error("Failed to read files", err));
    

    // Checking if versions are equal
    const fileByKey = _.keyBy(fileDataset, "prefix");
    const liveByKey = _.keyBy(liveDataset, "prefix");
    if (_.isEqual(fileByKey, liveByKey)) {
        console.info("NO CHANGES between live and repository datasets");
        return;
    } 
    console.info("CHANGES FOUND between live and repository datasets");
    

    // When they are not equal, update repository with live version 
    const orderedDataset = _.orderBy(liveDataset, "prefix");
    const liveStr = jsonStringify(orderedDataset, {space: 4});
    await writeFile("../registry-data/full.json", liveStr);

    const oldNamespaceFiles = (await readdir("../registry-data/namespaces/")).filter(file => file.endsWith(".json"));
    await Promise.all(oldNamespaceFiles.map(file => rm(`../registry-data/namespaces/${file}`, {force: true})));
    
    await Promise.all(Object.entries(liveByKey).map(async ([prefix, namespace]) => {
        const namespaceStr = jsonStringify(namespace, {space: 4});
        return writeFile(`../registry-data/namespaces/${prefix}.json`, namespaceStr);
    }));
}

main();