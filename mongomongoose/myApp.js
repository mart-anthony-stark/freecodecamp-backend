const mongoose = require("mongoose");
const Person = require("./models/person.model");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB..");
  })
  .catch((e) => {
    console.log(e);
  });

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Mart",
    age: 23,
    favoriteFoods: ["Chicken Breast"],
  });

  person.save((err, data) => {
    if (err) return done(err);

    done(null, data);
  });
};

const createManyPeople = async (arrayOfPeople, done) => {
  const people = await Person.create(arrayOfPeople);

  done(null, people);
};

const findPeopleByName = async (personName, done) => {
  const person = await Person.find({
    name: personName,
  });

  done(null, person);
};

const findOneByFood = async (food, done) => {
  const person = await Person.findOne({
    favoriteFoods: food,
  });
  done(null, person);
};

const findPersonById = async (personId, done) => {
  const person = await Person.findById(personId);

  done(null, person);
};

const findEditThenSave = async (personId, done) => {
  const foodToAdd = "hamburger";

  const data = await Person.findOne({ _id: personId });

  data.favoriteFoods.push(foodToAdd);
  await data.save((err, savedData) => {
    done(null, savedData);
  });
};

const findAndUpdate = async (personName, done) => {
  const ageToSet = 20;

  const data = await Person.findOneAndUpdate(
    {
      name: personName,
    },
    {
      age: ageToSet,
    },
    { new: true }
  );

  done(null, data);
};

const removeById = async (personId, done) => {
  const data = await Person.findByIdAndRemove(personId);

  done(null, data);
};

const removeManyPeople = async (done) => {
  const nameToRemove = "Mary";

  const data = await Person.deleteMany({
    name: nameToRemove,
  });

  done(null, data);
};

const queryChain = async (done) => {
  const foodToSearch = "burrito";

  const person = await Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec();

  done(null, person);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
