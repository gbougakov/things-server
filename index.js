const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const sql = require('sqlite3')
const db3 = new sql.Database('/Users/georgebougakov/Library/Containers/com.culturedcode.ThingsMac/Data/Library/Application Support/Cultured Code/Things/Things.sqlite3')
const adapter = new FileSync('db.json')
const db = low(adapter)
const cron = require("node-cron")
const express = require('express')
const moment = require('moment')

const app = express()
 
// Set some defaults
db.defaults({ tasksCompleted: [] }).write()

app.use('/public', express.static('public'))

app.get('/api/stats/7day', (req, res) => {
  res.json(db.get('tasksCompleted').filter(o => o.ts > moment().startOf('day').valueOf()).value())
})

cron.schedule("0 0 * * * *", () => {
  console.log('Running cron job')
  db3.get('SELECT COUNT(*) FROM TMTask WHERE trashed = 0 AND type = 0 AND status = 3 AND stopDate > strftime("%s", date((julianday("now") - 2440587.5)*86400.0, "unixepoch", "-1 days"))', [], (err, result) => {
    db.get('tasksCompleted').push({ ts: (new Date()).getTime(), tasks: result['COUNT(*)']}).write()
  })
})

app.listen(3000)