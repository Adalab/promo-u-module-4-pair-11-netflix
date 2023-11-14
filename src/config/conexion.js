const mongoose = require('mongoose');

const dbConnect = () => {
  const user = 'virginiaalvarez82';
  const pass = '30YrmzMCAEVJHNRN';
  const dbName = 'netflix';

  const uri = `mongodb+srv://${user}:${pass}@cluster0.5qvvhou.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  //mongodb+srv://virginiaalvarez82:<password>@cluster0.5qvvhou.mongodb.net/?retryWrites=true&w=majority


  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('conectado a MongoDB'))
    .catch((e) => console.log('error de conexión', e));
};
module.exports = dbConnect;