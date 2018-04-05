let moment = require('moment');

let date = moment();
date.add(1, "month").subtract(1, 'year').add(3, 'hour');
console.log(date.format('HH:mm'));