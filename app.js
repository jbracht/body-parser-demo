const express = require('express');
let app = express();

//---- NO BODY PARSER, MANUAL PARSING ----
app.post('/badway', (req, res) => {
  let rawBody = [];

  // if we receive data with our request, run this function:
  req.on("data", (chunk) => {
    // sometimes data for a request is divided into pieces
    // while it's traveling across the network, so this
    // ensures each piece is added to our `rawBody`:
    rawBody.push(chunk);
  });

  // once all the data for our request is sent, run this function:
  req.on("end", () => {
    console.log('before parsing: ', rawBody);
    // the `rawBody` comes back as something called a 'buffer'
    // which is basically unreadable nonsense to humans
    // so we call `toString()` to translate it into
    // something we can read and work with:
    const body = Buffer.concat(rawBody).toString();
    // body looks something like this now:
    // body = 'firstName=Jess&lastName=Bracht'
    // so we start parsing it to get the keys/values:
    let split = body.split(/[&=]/);
    // we split that body string into an array
    // based on '&' or '=' delimiters
    // split looks like this:
    // split = ['firstName', 'Jess', 'lastName', 'Bracht']

    // now we translate that array into an object. For each
    // i index of the array (the key), the i+1 index is it's
    // value. We assign these pairs to the object:
    let bodyObj = {};
    for(let i = 0; i < split.length; i+=2) {
      bodyObj[split[i]] = split[i+1];
    }

    // FINALLY! A parsed body object with key/value pairs!!
    console.log('body from manual parse: ', bodyObj);
  });

  // "exit" our server by sending a response. No other
  // code will run here until another request comes in
  res.send('all done here');
});

// since express runs IN ORDER, this line will only run
// if we didn't match the first route and kept looking
// for a matching route
app.use(express.urlencoded({extended: false}));

// ---- BODY PARSER INCLUDED ----
// activated a body parser via the line above
app.post('/goodway', (req, res) => {
  // our request went through a body parser (line 52)
  // so we have a nice 'body' property on our request
  // that's already been parsed and put in a convenient object
  console.log('body from auto parse: ', req.body);
  res.send('all done here');
})

app.listen(3000, () => {
  console.log('i am listening on port 3000!');
});
