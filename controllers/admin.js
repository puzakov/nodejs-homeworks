const { webError, lowdb } = require("../util");
const fs = require('fs');
const path = require('path');

exports.get = async (ctx, next) => {
  try {
    if (!ctx.session.isAuth) {
      ctx.redirect("/login");
      return;
    }

    ctx.render("admin", getSkillValues());
  } catch (err) {
    webError(err, ctx, 400);
  }
};

exports.postSkills = async (ctx, next) => {
  try {
    const { age, concerts, cities, years } = getSkillValues();
    const {
      age: newAge,
      concerts: newConcerts,
      cities: newCities,
      years: newYears
    } = ctx.request.body;

    if (age != newAge) setSkillValue("age", newAge);
    if (concerts != newConcerts) setSkillValue("concerts", newConcerts);
    if (cities != newCities) setSkillValue("cities", newCities);
    if (years != newYears) setSkillValue("years", newYears);

    ctx.redirect("/admin");
  } catch (err) {
    webError(err, ctx, 400);
  }
};

exports.postUpload = async (ctx, next) => {
  try {
    const { name, price } = ctx.request.body;
    const { name: photoName, size, path: tempPath } = ctx.request.files.photo;
    const uploadDir = path.join(
      process.cwd(),
      "/public",
      "assets",
      "img",
      "products"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (!name || !price) {
      fs.unlinkSync(tempPath);
      throw "All fields are required";
    }
    if (!photoName || !size) {
      fs.unlinkSync(tempPath);
      throw "File not saved";
    }

    fs.renameSync(tempPath, path.join(uploadDir, photoName));

    lowdb
      .get("products")
      .push({
        src: "./assets/img/products/" + photoName,
        name: name,
        price: price
      })
      .write();

    ctx.redirect("/admin");
  } catch (err) {
    webError(err, ctx, 400);
  }
};

const setSkillValue = (key, value) => {
  lowdb
    .get("skills")
    .find({ id: key })
    .assign({ number: parseInt(value) })
    .write();
};

const getSkillValues = () => {
  return {
    age: lowdb
      .get("skills")
      .find({ id: "age" })
      .get("number")
      .value(),
    concerts: lowdb
      .get("skills")
      .find({ id: "concerts" })
      .get("number")
      .value(),
    years: lowdb
      .get("skills")
      .find({ id: "years" })
      .get("number")
      .value(),
    cities: lowdb
      .get("skills")
      .find({ id: "cities" })
      .get("number")
      .value()
  };
};
