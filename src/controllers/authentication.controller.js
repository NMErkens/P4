const logger = require('../config/appconfig').logger
const database = require('../datalayer/mssql.dao')
const assert = require('assert')
const jwt = require('jsonwebtoken')
//const auth = require('../utility/authentication/authentication')
const secretKey = require('../config/appconfig').secretKey

module.exports = {
  
  register: (req, res, next) => {
    logger.info('register aangeroepen')

    // req.body uitlezen, geeft user data
    // - valideer de juistheid
    const user = req.body
    console.log(req.body)

    // INSERT query samenstellen met user data
    const query =
      `INSERT INTO [DBUser] (FirstName, LastName, StreetAddress, ` +
      `PostalCode, City, DateOfBirth, PhoneNumber, EmailAddress, Password) ` +
      ` VALUES('${user.FirstName}', '${user.LastName}', ` +
      `'${user.StreetAddress}', '${user.PostalCode}', '${user.City}', ` +
      `'${user.DateOfBirth}', '${user.PhoneNumber}', '${user.EmailAddress}', ` +
      `'${user.Password}'); SELECT SCOPE_IDENTITY() AS UserId`

      
        var zipCodePattern = /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i;
        var phoneNumberPattern = RegExp('(?=^.{10,11}$)0\d*-?\d*');
        var emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm
        var postalcode = user.PostalCode;
        var phoneNUmber = user.PhoneNumber;
        var email = user.EmailAddress;

        try {
          // Add validators to certain fields
          assert(zipCodePattern.test(postalcode), 'postal code invalid. (must be dutch)');
          assert(phoneNumberPattern.test(phoneNUmber), 'phonenumber invalid.');
          assert(emailPattern.test(email), 'email invalid.');

        } catch (ex) {
          const errorObject = {
            message: 'Validation fails: ' + ex.toString(),
            code: 500
          }
          return next(errorObject)
        }
    // Query aanroepen op de database 
      database.executeQuery(query, (err, rows) => {
        if (err) {
          const errorObject = {
            message: 'Er ging iets mis in de database.',
            sql: {
              message: err.message,
              code: err.code
            },
            code: 500
          }
          next(errorObject)
        }/*
        if(zipCodePattern.test(postalcode) == false || phoneNumberPattern.test(phoneNUmber) == false){
          const msg = "invalid Postalcode (must be dutch) or phonenumber";
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 406
          }
          logger.info(rows.recordset[0].UserId);
          //var id = rows.recordset[0].UserId;
          //const query2= `DELETE FROM DBUser WHERE ApartmentId=${id}`
          //database.executeQuery(query2);
          //res.status(401).json(errorObject)
          next(errorObject)
        }*/
        if (rows) {
            res.status(200).json({ result: rows.recordset[0] })  
        }
      })  
  },

  login: (req, res, next) => {
    logger.info('login aangeroepen')

    // req.body uitlezen, geeft user data
    // ToDo: valideer dat we de juiste data ontvangen
    const user = req.body
    logger.trace('user: ', user)

    // query samenstellen met user data
    const query = `SELECT UserId, Password FROM [DBUser] WHERE EmailAddress = '${req.body.EmailAddress}'`
    logger.trace(query)

    // Query aanroepen op de database
    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        // Als we hier zijn:
        if (rows.recordset.length === 0) {
          // User niet gevonden, email adress bestaat niet
          res.status(401).json({ error: "User not found" })
        } else {
          // User gevonden, check passwords
          logger.info(rows.recordset[0].Password + " , " + req.body.password)
          if (req.body.Password === rows.recordset[0].Password) {
            logger.info('Password match, user logged id')
            logger.trace(rows.recordset)

            const payload = {
              UserId: rows.recordset[0].UserId
            }

            jwt.sign({ data: payload }, secretKey, { expiresIn: 60 * 60 }, (err, token) => {
              if (err) {
                const errorObject = {
                  message: 'Kon geen JWT genereren.',
                  code: 500
                }
                next(errorObject)
              }
              if (token) {
                res.status(200).json({
                  result: {
                    token: token
                  }
                })
              }
            })
          } else {
            logger.info('Passwords DO NOT match')
            res.status(401).json({ error: "Passwords DO NOT match" })
          }
        }
      }
    })
  },

  validateToken: (req, res, next) => {
    logger.info('validateToken aangeroepen')
    // logger.debug(req.headers)
    const authHeader = req.headers.authorization
    if (!authHeader) {
      errorObject = {
        message: 'Authorization header missing!',
        code: 401
      }
      logger.warn('Validate token failed: ', errorObject.message)
      return next(errorObject)
    }
    const token = authHeader.substring(7, authHeader.length)

    jwt.verify(token, secretKey, (err, payload) => {
      if (err) {
        errorObject = {
          message: 'not authorized',
          code: 401
        }
        logger.warn('Validate token failed: ', errorObject.message)
        next(errorObject)
      }
      if (payload) {
        logger.debug('token is valid', payload)
        // User heeft toegang. Voeg UserId uit payload toe aan
        // request, voor ieder volgend endpoint.
        req.user = payload.data
        next()
      }
    })
  },

  getAll: (req, res, next) => {
    logger.info('getAll aangeroepen')

    // query samenstellen met user data
    const query = `SELECT * FROM [DBUser]`

    // Query aanroepen op de database
    database.executeQuery(query, (err, rows) => {
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  }


}

//('^06(| | -)[0 - 9]{8}$')
