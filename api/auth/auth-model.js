const db = require('../../data/dbConfig');

function findBy(filter) {
    return db("users as u").where(filter).first();
}
  
function findById(id) {
    return db("users as u").where("u.id", id).first();
}

async function add(user) {
    const [id] = await db("users").insert(user, "id")
    return findById(id)
}

module.exports = {
    findBy,
    findById,
    add
}