# Identifiers.org registry data

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/identifiers-org/registry-data?logo=Github&)
![GitHub last commit](https://img.shields.io/github/last-commit/identifiers-org/registry-data?path=registry-data&label=last%20update)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/identifiers-org/registry-data/periodic-updates.yaml?logo=Github&label=periodic%20update)

**This is not the live registry data, only a mirror created for backup and versioning purposes. Changes to these files do not affect the identifiers.org services.**

If there are any issues or you wish to update the identifiers.org registry, please [contact us](https://docs.identifiers.org/pages/contact) or open an issue at [our main issue board](https://github.com/identifiers-org/identifiers-org.github.io/issues).

The live version of the registry can be found at <https://registry.api.identifiers.org/resolutionApi/getResolverDataset>.
This repository can be out of date depending on the periodicity of the [update action](https://github.com/identifiers-org/registry-data/actions/workflows/periodic-updates.yaml).

## The dataset
All the dataset files are available in the [registry-data](./registry-data/) folder. 
They are stored in the JSON format available at the live endpoint listed above.
The file [full.js](./registry-data/full.json) contains the full dump of the registry. 
The dump is also available split by namespace under the [registry-data/namespaces](./registry-data/namespaces/) folder.

## Versioning
The current version of the repository is found at the file called [VERSION](./VERSION) at the root of the repository.
The commit history can be used to check recent changes to the identifiers.org registry.

### Checking history via Github.com UI

Recent changes to the dataset can be seen in the [commit history of full.json](https://github.com/identifiers-org/registry-data/commits/master/registry-data/full.json). 
You will have to click on individual commits to see its changes.

Alternatively, recent changes to an individual namespace can be seen in the commit history of the specific namespace file, for example, [the commit history for 3dmet can be found here](https://github.com/identifiers-org/registry-data/commits/master/registry-data/namespaces/3dmet.json). 
Again, You will have to click on individual commits to see its changes.

### Checking history via git command line

After cloning the repository and opening a terminal there, you can list recent changes to the dataset using the following command:
```bash
git log --patch -10 registry-data/ 
```

The similar command below can be used to see changes on a specific namespace file:
```bash
git log --patch -10 registry-data/namespaces/3dmet.json 
```
