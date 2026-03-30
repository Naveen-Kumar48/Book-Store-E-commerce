const env = (process.env.NODE_ENV || 'development').trim();
require("dotenv").config({
  path: `./config.${env}.env`,
});

const app = require("./app");
const connectDB = require("./config/db");

console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Email User:', process.env.EMAIL_USER ? '✓ set' : '✗ MISSING');
console.log('Email Pass:', process.env.EMAIL_PASS ? '✓ set' : '✗ MISSING');
console.log('MongoDB URL:', process.env.MONGODB_URL ? '✓ set' : '✗ MISSING');
console.log('JWT Secret:', process.env.JWT_SECRET ? '✓ set' : '✗ MISSING');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('\n⚠️  WARNING: EMAIL_USER or EMAIL_PASS not set. Email functionality will fail!');
  console.error('Please set these environment variables in your hosting platform.\n');
}

connectDB();
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server is running http://localhost:${port}`);
});

//? stages
//todo--- development , testing(qa) , preProduction , production
//         3000      ,   3001      , 5000        , 3002
//         dev       ,  test      , preDB       , DB+
