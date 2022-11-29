const express = require('express')
const router = express.Router()

const postmodel = require('../../models/postM')

router.get('/', async(req, res) => {
    const all_post = await postmodel.find().sort({date:'desc'})
    // console.log(all_post)
    res.render('user/indexU', { all_post: all_post })
})

router.post('/add_comment', async(req, res) => {
    
    const addcommentin=await postmodel.findById(req.body.getid)
    

    try {
        
        //  console.log(req.body.getid)
        //  console.log(req.body.username)
        // console.log(req.body.write_comment)
        // console.log(req.body.timeofcomment)
        
        
        const updatedpost=await addcommentin.comment.push({username:(req.body.username),cmnt:(req.body.write_comment),time:(req.body.timeofcomment)})
         let z=await addcommentin.save()

        res.redirect(`/user/post/${req.body.getid}`)
        
    } catch (error) {
        console.error(error)
    }
    

})

//FIND POST BY ID:-
router.get('/:id',async(req,res)=>{
    const grabbyid= await postmodel.findById(req.params.id)
    res.render('user/selectedpostU',{grabbyid:grabbyid})
})


module.exports=router


