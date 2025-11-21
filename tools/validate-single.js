const SwaggerParser = require('@apidevtools/swagger-parser');
const path = require('path');

async function validate(file) {
  try {
    const spec = await SwaggerParser.validate(file);
    console.log(`✅ ${path.basename(file)} is valid`);
    return true;
  } catch (err) {
    console.error(`❌ Error in ${path.basename(file)}:`);
    console.error('Message:', err.message);
    if (err.details) {
      console.error('Details:', err.details);
    }
    return false;
  }
}

validate(process.argv[2]);
