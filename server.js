const jsonServer = require('json-server');
const pause = require('connect-pause');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults()
const bodyParser = require('body-parser');
const fs = require('fs');

const port = 3001

server.use(middlewares)
server.use(bodyParser.json())

/* ===== user =====*/
server.get('/user/getUser', (req, res, next) => {
  req.url = '/user';
  next()
})

/* ===== template =====*/

server.post('/template/getTemplates', (req, res, next) => {
  req.method = 'GET';
  req.url = '/templates';
  next()
})
server.post('/template/getTemplate', (req, res, next) => {
  req.method = 'GET';
  req.url = `/templates/${req.body.TemplateId}`;
  next()
})
server.post('/template/setTemplate', (req, res, next) => {
  req.method = 'PUT';
  req.body = req.body.Template
  req.url = `/templates/${req.body.ID}`;
  next()
})
server.post('/template/deleteTemplate', (req, res, next) => {
  req.method = 'DELETE';
  req.url = `/templates/${req.body.TemplateId}`;
  next()
})
server.post('/template/createTemplate', (req, res, next) => {
  req.url = `/templates`;
  req.body = {
    Name: req.body.TemplateName,
    LastUpdated: "2019-09-16T10:53:33.0220985+02:00",
  };
  next()
})


/* ===== piaf =====*/
server.post('/piaf/getServers', (req, res, next) => {
  req.method = 'GET';
  req.url = '/servers';
  next()
})
server.post('/piaf/getDatabases', (req, res, next) => {
  req.method = 'GET';
  req.url = '/databases';
  next()
})
server.post('/piaf/getDatabaseElements', (req, res, next) => {
  req.method = 'GET';
  req.url = '/databaseElements';
  next()
})
server.post('/piaf/getElementStructure', (req, res, next) => {
  req.method = 'GET';
  req.url = '/elementStructure';
  next()
})

server.post('/piaf/getDatabaseEventFrameTemplates', (req, res, next) => {
  req.method = 'GET';
  req.url = '/eventFrameTemplates';
  next()
})
server.post('/piaf/getEventFrameTemplate', (req, res, next) => {
  req.method = 'GET';
  req.url = '/eventFrameTemplate';
  next()
})

server.post('/piaf/createPiAfEventFrame', (req, res) => {
  let result = req.body
  res.json(result)
})  









/* ===== data =====*/


server.post('/data/getData', (req, res) => {
  let rawdata = fs.readFileSync("db.json", "utf-8");
  let data = JSON.parse(rawdata)
  let index = data.templates.findIndex(i => i.ID === req.body.TemplateId);
  let result = {
    TemplateID: req.body.TemplateId,
    LastUpdated: "2019-09-16T10:53:33.0220985+02:00",
    Body: {
      TemplateData: data.templates[index].Body.dashboard.map(i => {
        return {
          ControlID: i.id,
          ErrorMessage: "Index was outside the bounds of the array.",
          HasError: i.piafAttribute.name === null ? true : false,
          Value: i.piafAttribute.name !== null ? 123 : null
        }
      })
    }
  }
  res.json(result)
})

server.post('/data/sendData', (req, res) => {
  let result = req.body
  result.Body.TemplateData = result.Body.TemplateData.map(i => {
    return {
      ControlID: i.ControlID,
      ErrorMessage: "Index was outside the bounds of the array.",
      HasError: true,
      Value: i.Value
    }
  })
  res.json(result)
})






server.use(pause(300));
router.db._.id = 'ID'; // set id option here
server.db = router.db;

server.use(jsonServer.bodyParser)

server.use(router)

server.listen(port, () => {
  console.log(`JSON Server is running in port :${port}`)
})