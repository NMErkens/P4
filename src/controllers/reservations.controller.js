const logger = require('../config/appconfig').logger
const database = require('../datalayer/mssql.dao')

module.exports = {
    getAllReservations: (req, res, next) => {
        logger.info('Get /api/reservations aangeroepen.git')
    
        const query = 'SELECT * FROM Reservation;'
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
    }
}