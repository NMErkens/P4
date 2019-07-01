const logger = require('../config/appconfig').logger
const database = require('../datalayer/mssql.dao')

module.exports = {
  createAppartments: function(req, res, next) {
    logger.info('Post /api/Appartments aangeroepen')

    // Check dat we de UserId in het request hebben - vanuit de validateToken functie.
    logger.trace('User info:', req.user)

    // hier komt in het request een appartment binnen.
    const Appartment = req.body
    // ToDo: Valideer hier de properties van de appartment die we gaan maken.

    //logger.info(Appartment.UserId)
    
    logger.info("________("+Appartment.Description +"','" +Appartment.StreetAddress +"','" +Appartment.PostalCode +"','" +Appartment.City +"','" +req.user.UserId )


    const query =
      "INSERT INTO Apartment(Description, StreetAddress, PostalCode, City, UserId) VALUES ( '" + 
      Appartment.Description +
      "','" +
      Appartment.StreetAddress +
      "','" +
      Appartment.PostalCode +
      "','" +
      Appartment.City +
      "','" +
      //Appartment.UserId +
      req.user.UserId +
      "'); SELECT * FROM Apartment JOIN DBUser ON Apartment.UserId = DBUser.UserId WHERE ApartmentId = SCOPE_IDENTITY();"
      
      console.log(query);
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
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
  },

  getAllAppartments: (req, res, next) => {
    logger.info('Get /api/Appartments aangeroepen')

    const query = 'SELECT * FROM Apartment;'
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
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
  },

  getAppartmentById: function(req, res, next) {
    logger.info('Get /api/Appartments/id aangeroepen')

    const id = req.params.appartmentsId;
    const query = `SELECT * FROM Apartment WHERE ApartmentId=${id};`
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          // query ging goed, maar geen film met de gegeven ID's.
          // -> retourneer een error!
          const msg = 'Apartment not found'
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 404
          }
          res.status(404).json({ errorObject })
        }
        else{
          res.status(200).json({ result: rows.recordset })
        }
        
      }
    })
  },

  deleteAppartmentById: function(req, res, next) {
    logger.info('deleteById aangeroepen')
    const id = req.params.appartmentsId
    const userId = req.user.UserId

    const query = `DELETE FROM Apartment WHERE ApartmentId=${id} AND UserId=${userId}`// 
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        logger.trace('Could not delete Apartment: ', err)
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          // query ging goed, maar geen film met de gegeven ID's.
          // -> retourneer een error!
          const msg = 'Apartment not found or you have no access!'
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 401
          }
          res.status(401).json({ errorObject })
          // Let hier op de 'return' - anders gaat Node gewoon verder.
          // return next(errorObject)
        }else{
          res.status(200).json({ result: rows })
          logger.info("succesvol verwijdert")
        }
        
      }
    })
  },

  updateAppartments: function(req, res, next) {
    logger.info('Update /api/Appartments/id aangeroepen')

    logger.trace('User info:', req.user)

    const Appartment = req.body
    const id = req.params.appartmentsId
    const userId = req.user.UserId
    
    logger.info("________("+Appartment.Description +"','" +Appartment.StreetAddress +"','" +Appartment.PostalCode +"','" +Appartment.City +"','" +req.user.UserId )
    const query = "UPDATE Apartment SET Description = '" + Appartment.Description 
    + "', StreetAddress = '" + Appartment.StreetAddress
    + "', PostalCode = '" + Appartment.PostalCode
    + "', City= '"  + Appartment.City 
    + `' WHERE ApartmentId=${id} AND UserId=${userId}`
    
      console.log(query);
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          // query ging goed, maar geen film met de gegeven ID's.
          // -> retourneer een error!
          const msg = 'Apartment not found or you have no access!'
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 404
          }
          res.status(401).json({ errorObject })
        }else{
            res.status(200).json({ rows })
        }
        
      }
    })
  },


  //RESERVATIONS_____________________________________________________________________________________________

  getReservation: (req, res, next) => {
    logger.info('Get /api/Appartments/id/reservations aangeroepen')

    const appartmentId = req.params.appartmentsId
    const query = `SELECT * FROM Reservation WHERE ApartmentId = ${appartmentId};`

    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if (rows.rowsAffected[0] === 0){
          const msg = 'reservation not found'
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 404
          }
          res.status(404).json({ msg })
        }else{
          res.status(200).json({ result: rows.recordset })
        }
        
      }
    })
  },
  createReservation:  (req, res, next) => {
    logger.info('Post /api/Appartments/id aangeroepen')

    const Reservation = req.body
    const userId = req.user.UserId
    const id = req.params.appartmentsId
    
    //logger.info("________("+Appartment.Description +"','" +Appartment.StreetAddress +"','" +Appartment.PostalCode +"','" +Appartment.City +"','" +req.user.UserId )


    const query =
    `INSERT INTO [Reservation] (ApartmentId, StartDate, ` +
    `EndDate, Status, UserId) ` +
    ` VALUES('${id}', '${Reservation.StartDate}', ` +
    `'${Reservation.EndDate}', '${Reservation.Status}', '${userId}');`
    
      console.log(query);
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
          res.status(200).json({ result: rows.recordset + " succesvol toegevoegd" })
      }
    })
  },

  getReservationById: (req, res, next) => {
    logger.info('Get /api/Appartments/id/reservations aangeroepen')
    
    const appartmentId = req.params.appartmentsId
    const reservationId = req.params.reservationsId
    const query = `SELECT * FROM Reservation WHERE ApartmentId = ${appartmentId} AND ReservationId = ${reservationId};`
    
    logger.info(req.id);
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database!!!.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        res.status(200).json({ result: rows.recordset })
      }
    })
  },

  updateReservation: (req, res, next) => {
    logger.info('Get /api/Appartments/id/reservations aangeroepen')
    
    //________________________________________________

    const appartmentId = req.params.appartmentsId
    const reservationId = req.params.reservationsId
    const reservation = req.body;
    const userId = req.user.UserId;

    const query = "UPDATE Reservation SET Status = '" + reservation.Status + 
    `' WHERE ApartmentId = ${appartmentId} AND ReservationId = ${reservationId} AND UserId = ${userId};`
    
    logger.info(req.id);
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if (rows.rowsAffected[0] === 0){
          const msg = 'reservation not found or you have no access!'
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 401
          }
          res.status(401).json({ msg })
        }
        else{
          res.status(200).json({ result: rows.recordset + " Rows succesfully updated" })
        }
        
      }
    })
  },

  deleteReservationById: function(req, res, next) {
    logger.info('deleteById aangeroepen')
    const appartmentId = req.params.appartmentsId
    const reservationId = req.params.reservationsId
    const userId = req.user.UserId

    const query = `DELETE FROM Reservation WHERE ReservationId = ${reservationId} AND ApartmentId = ${appartmentId} AND UserId = ${userId};;`// 
    
    database.executeQuery(query, (err, rows) => {
      // verwerk error of result
      if (err) {
        logger.trace('Could not delete reservation: ', err)
        const errorObject = {
          message: 'Er ging iets mis in de database.',
          code: 500
        }
        next(errorObject)
      }
      if (rows) {
        if (rows.rowsAffected[0] === 0) {
          // query ging goed, maar geen film met de gegeven ID's.
          // -> retourneer een error!
          const msg = 'reservation not found or you have no access!'
          logger.trace(msg)
          const errorObject = {
            message: msg,
            code: 404
          }
          res.status(404).json({ msg})
          // Let hier op de 'return' - anders gaat Node gewoon verder.
          // return next(errorObject)
        }
        else{
          res.status(200).json({ result: rows + " succesvol verwijdert"})
          logger.info("succesvol verwijdert")
        }
        
      }
    })
  }


}
