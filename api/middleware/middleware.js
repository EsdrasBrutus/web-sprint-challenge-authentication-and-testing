const User = require("../auth/auth-model")

const checkUsernameExists = async (req, res, next) => {
      try{
        const user = await User.findBy({username: req.body.username})
        if (user.length){
          req.userData = user[0]
          next()
        }
        else{
          res.status(401).json({message: "invalid credentials"})
        }
      }
      catch(e){
        res.status(500).json({message:"Server error"})
      }
}

const checkUsernameFree = async (req, res, next) => {
    try{
      const user = await User.findBy({username: req.body.username})
      if (!user.length){
        next()
      }
      else{
        res.status(422).json({message: "username taken" })
      }
    }
    catch(e){
      res.status(500).json(`Server error: ${e}`)
    }
  }

  const checkPayload = (req, res, next) => {
      const { username, password } = req.body
      console.log(req.body)
      if (!username || !password){
          res.status(400).json({message: "username and password required"})
      }
      else{
          next()
      }
  }

module.exports ={
    checkPayload,
    checkUsernameExists,
    checkUsernameFree
}


