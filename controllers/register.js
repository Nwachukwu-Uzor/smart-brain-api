const handleRegister = (req, res, dbPostgres, bcrypt) => {
  const { email, name, password } = req.body; 
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect submission');
  }
  const hash = bcrypt.hashSync(password);

  dbPostgres.transaction(trx => {
      trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            }).then(user => {
              res.json(user[0])
            })
        })
        .then(trx.commit)
        .then(trx.rollback)
    })
    .catch(err => res.status(400).json('error unable to register, check email'))
}

module.exports = {
  handleRegister: handleRegister
}