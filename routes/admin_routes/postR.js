const express = require('express')
const router = express.Router()
const { ensureAuthenticate } = require('../../config/auth')
const multer = require('multer')

const postmodel = require('../../models/postM')

//storage for multer
const storage = multer.diskStorage({

    // destination for file save 
    destination: (request, file, callback) => {
        callback(null, './static/uploads')
    },

    // add back the extension
    filename: (request, file, callback) => {
        callback(null, Date.now() + file.originalname)

    }
})

//upload parameter for multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3,
    }
})


router.get('/', ensureAuthenticate, async (req, res) => {
    const all_post = await postmodel.find().sort({ date: 'desc' })
    // console.log(all_post)
    res.render('admin/index', { all_post: all_post })
})

//ADD POST:-
router.get('/add_post', ensureAuthenticate, (req, res) => {
    res.render('admin/add_post')
})

router.post('/add_post', upload.single('image'), async (req, res) => {
    const newpost = await new postmodel({

        title: req.body.title,
        desc: req.body.desc,
        img: req.file.filename
        // date : req.body.date
    })
    // console.log(newpost)

    try {
        const a1 = await newpost.save()
        res.redirect('/admin/post')

    } catch (error) {
        console.error(error)

    }

})

//FIND POST BY ID:-
router.get('/:id', ensureAuthenticate, async (req, res) => {

    const grabbyid = await postmodel.findById(req.params.id)
    // console.log(grabbyid)
    res.render('admin/selectedpost', { grabbyid: grabbyid })

})

//DELETE POST
router.delete('/delete/:id', async (req, res) => {
    const todel = await postmodel.findByIdAndDelete(req.params.id)
    res.redirect('/admin/post')
})

//EDITING POST
router.get('/edit/:id', ensureAuthenticate, async (req, res) => {

    const grabbyidforedit = await postmodel.findById(req.params.id)
    res.render('admin/editpost', { grabbyidforedit: grabbyidforedit })

})



router.post('/edit/:id', async (req, res) => {

    // const a1=await postmodel.findById(req.params.id)
    // console.log(a1)

    const a2 = {}
    a2.title = req.body.title
    a2.desc = req.body.desc

    try {
        const updatedpost = await postmodel.updateOne({ _id: (req.params.id) }, a2)
        res.redirect(`/admin/post/${req.params.id}`)

    } catch (error) {
        console.error(error)
    }



})

router.post('/add_comment', async (req, res) => {

    const addcommentin = await postmodel.findById(req.body.getid)


    try {

        //  console.log(req.body.getid)
        //  console.log(req.body.username)
        // console.log(req.body.write_comment)
        // console.log(req.body.timeofcomment)


        const updatedpost = await addcommentin.comment.push({ username: (req.body.username), cmnt: (req.body.write_comment), time: (req.body.timeofcomment) })
        let z = await addcommentin.save()

        res.redirect(`/admin/post/${req.body.getid}`)

    } catch (error) {
        console.error(error)
    }
})



module.exports = router

