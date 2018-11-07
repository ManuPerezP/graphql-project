const pwd = "dichone7";
const express = require('express');
const graphglHTTP = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema')
const testSchema = require('./schema/types_schema')

const cors = require('cors');
const port = process.env.PORT || 4000;


const app = express();
/*
 mongodb://bawp:lalalal@ds143603.mlab.com:43603/gq-course
*/


mongoose.connect('mongodb://bawp:'+pwd+'@ds143603.mlab.com:43603/gq-course',
{ useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Yes!  We are connected!');
});


 app.use(cors());
 app.use('/graphql', graphglHTTP({
      graphiql: true,
      schema: schema
    
 }))

app.listen(port, () => { //localhost:4000
     console.log('LLLLListening for requests on my awesome port 4000');
     
})
