'use strict';

/**
* Simple random alphanumeric string generator.
* @param {number} length of string, to a maximum of 36
* @return {string} The generated string
*/
module.exports.getRandomString = len => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
  .split('')
  .sort(() => 0.5 - Math.random())
  .slice(0,len)
  .join('');
