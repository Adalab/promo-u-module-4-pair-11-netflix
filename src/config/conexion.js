const mongoose = require('mongoose');

const dbConnect = () => {
  const user = 'virginiaalvarez82';
  const pass = 'cNNKI20vI66zJ4bK';
  const dbName = 'netflix';

  const uri = `mongodb+srv://${user}:${pass}@cluster0.v4fvtsu.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  //mongodb+srv://virginiaalvarez82:<password>@cluster0.5qvvhou.mongodb.net/?retryWrites=true&w=majority

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('conectado a MongoDB'))
    .catch((e) => console.log('error de conexión', e));
};
module.exports = dbConnect;