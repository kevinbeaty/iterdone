var /* global Symbol */
    /* jshint newcap:false */
    symbolExists = typeof Symbol !== 'undefined'

module.exports = symbolExists ? Symbol.iterator : '@@iterator'
