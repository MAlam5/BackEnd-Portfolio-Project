exports.handleServerError =(err,req,res, next)=>{
    console.log(err)
    res.send(500).send(msg:'Internal Sever Error')
}