const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '89822f9718854c59ad37b1d800f5e85e'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data)
    })
    .catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (req, res, dbPostgres) =>  {
  const { id } = req.body;
  dbPostgres('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
      res.json(entries[0])
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}