/**
 * Índice dos modelos do HangarOne
 * Facilita a importação e uso dos modelos
 */

const Club = require('./Club');
const Pilot = require('./Pilot');
const Aircraft = require('./Aircraft');
const Document = require('./Document');
const Flight = require('./Flight');
const Maintenance = require('./Maintenance');
const Payment = require('./Payment');

module.exports = {
  Club,
  Pilot,
  Aircraft,
  Document,
  Flight,
  Maintenance,
  Payment
};

// Exemplo de uso:
// const { Pilot, Aircraft } = require('./models');
// const pilot = new Pilot({ name: 'João', clubId: 1, ... });