const fs = require("fs");
const path = require("path");
const util = require("util");

const fsMkdir = util.promisify(fs.mkdir);
const fsCopyFile = util.promisify(fs.copyFile);
const fsReaddir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.stat);
const fsUnlink = util.promisify(fs.unlink);
const fsRmdir = util.promisify(fs.rmdir);

let sourceDir = null;
let resultDir = null;
let removeSource = false;

const argError = message => {
  console.log(message);
  process.exit(1);
};

const checkArgs = async () => {
  const params = process.argv.slice(2);
  console.log(params);

  const indexSource = params.indexOf("-s");
  if (indexSource >= 0) {
    try {
      await fsStat(params[indexSource + 1]);
      sourceDir = params[indexSource + 1];
    } catch (err) {
      argError("Unavailable param: source");
    }
  }
  const indexResult = params.indexOf("-r");
  if (indexResult >= 0) {
    resultDir = params[indexResult + 1];
  }
  if (params.indexOf("-d") >= 0) {
    removeSource = true;
  }

  if (!sourceDir || !resultDir) {
    argError("=source= and =result= are required params!");
  }
  console.log({ sourceDir, resultDir, removeSource });
};

const migrateFile = async file => {
  const { base } = path.parse(file);
  const newFileDir = path.join(resultDir, base.substring(0, 1).toUpperCase());
  const newFilePath = path.join(newFileDir, base);
  const sourceResolved = path.resolve(file);
  const destResolved = path.resolve(newFilePath);

  try {
    await fsStat(newFileDir);
  } catch (err) {
    await fsMkdir(newFileDir, { recursive: true });
  }  

  await fsCopyFile(sourceResolved, destResolved);
  console.log(`${file} was copied to ${newFilePath} \r`);
  if (removeSource) {
    await fsUnlink(file);
    console.log(`${file} was deleted; \r`);
  }
};

const processDirRecursive = async (base, level) => {
  const files = await fsReaddir(base);
  const dirPromise = Promise.all(
    files.map(async item => {
      let localBase = path.join(base, item);
      let state = await fsStat(localBase);
      if (state.isDirectory()) {
        await processDirRecursive(localBase, level + 1);
      } else {
        await migrateFile(localBase);
      }
    })
  );

  await dirPromise;
  if (removeSource) {
    await fsRmdir(base);
    console.log(`Directory ${base} was deleted; \r`);
  }
};

const go = async () => {
  await checkArgs();
  processDirRecursive(sourceDir, 0);
};

go();
