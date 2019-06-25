const { lowdb } = require("../util");
const fs = require("fs");
const path = require("path");

exports.get = (request, response) => {
  if (!request.session.isAuth) {
    response.redirect("/login");
    return;
  }

  response.render("admin", { ...getSkillValues(), ...request.flash() });
};

exports.postSkills = (request, response) => {
  const { age, concerts, cities, years } = getSkillValues();
  const {
    age: newAge,
    concerts: newConcerts,
    cities: newCities,
    years: newYears
  } = request.body;

  if (age != newAge) setSkillValue("age", newAge);
  if (concerts != newConcerts) setSkillValue("concerts", newConcerts);
  if (cities != newCities) setSkillValue("cities", newCities);
  if (years != newYears) setSkillValue("years", newYears);

  response.redirect("/admin");
};

exports.postUpload = (request, response) => {
  const { name, price } = request.body;
  const { name: photoName, size, mv } = request.files.photo;
  const uploadDir = path.join(
    process.cwd(),
    "/public",
    "assets",
    "img",
    "products"
  );
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    if (!name || !price) {
      throw "All fields are required";
    }
    if (!photoName || !size) {
      throw "File not saved";
    }

    mv(path.join(uploadDir, photoName));

    lowdb
      .get("products")
      .push({
        src: "./assets/img/products/" + photoName,
        name: name,
        price: price
      })
      .write();
  } catch(err) {
    request.flash("msgfile", err);
  }
  response.redirect("/admin");
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
