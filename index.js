const fs = require("fs");
const path = require("path");
const util = require("util");

const fsMkdir = util.promisify(fs.mkdir);
const fsCopyFile = util.promisify(fs.copyFile);

let sourceDir = null;
let resultDir = null;
let removeSource = false;
const FilesState = [];

const argError = message => {
  console.log(message);
  process.exit(1);
};

const checkArgs = () => {
  const params = process.argv.slice(2);

  params.forEach((item, index) => {
    switch (item) {
      case "--source": {
        if (fs.existsSync(params[index + 1])) {
          sourceDir = params[index + 1];
        } else {
          argError("Unavailable param: source");
        }
        break;
      }
      case "--result": {
        resultDir = params[index + 1];
        break;
      }
      case "--removeSource": {
        removeSource = true;
        break;
      }
    }
  });

  if (!sourceDir || !resultDir) {
    argError("=source= and =result= are required params!");
  }

  const resultParamsObject = { sourceDir, resultDir, removeSource };
  console.log(resultParamsObject);
};

const copyFile = (source, dest) => {
  const sourceResolved = path.resolve(source);
  const destResolved = path.resolve(dest);

  fsCopyFile(sourceResolved, destResolved)
    .then(() => {
      console.log(`${source} was copied to ${dest} \r`);
      const fileState = FilesState.find(item => item.file === source);
      if (fileState) {
        fileState.processed = true;
      }
    })
    .catch(err => {
      throw err;
    });
};

const migrateFile = async file => {
  const { base } = path.parse(file);
  const newFileDir = path.join(resultDir, base.substring(0, 1).toUpperCase());
  const newFilePath = path.join(newFileDir, base);

  if (!fs.existsSync(newFileDir)) {
    await fsMkdir(newFileDir, { recursive: true });
  }
  copyFile(file, newFilePath);
};

const processDirRecursive = (base, level) => {
  const files = fs.readdirSync(base);

  files.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      processDirRecursive(localBase, level + 1);
    } else {
      FilesState.push({ file: localBase, processed: false });
      migrateFile(localBase);
    }
  });
};

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const waitingToRemoveSource = () => {
  console.log("Monitoring...");
  const allProcessed = FilesState.reduce(
    (acc, { processed }) => acc && processed
  );

  if (allProcessed) {
    deleteFolderRecursive(sourceDir);
    console.log("Source dir removed!");
  } else {
    setTimeout(waitingToRemoveSource, 100);
  }
};

checkArgs();
processDirRecursive(sourceDir, 0);

if (removeSource) {
  waitingToRemoveSource();
}
