const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

// Route 1
//// get all the notes using get " /api/auth/fetchallnotes "
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("intenal sever occured")
    }
})

// Route 2
//// add a new notes using post " /api/auth/addnote " login required
router.post('/addnote', fetchuser, [
    body('title', "title length is must be 3").isLength({ min: 3 }),
    body('description', "description  length is must be 5").isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        //// if there are error , return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const savenote = await notes.save()
        res.json(notes)

    } catch (error) {
        console.log(error.message);
        res.status(500).send("internal server error")
    }
})

// Route 3
//// update a existing notes using put " /api/auth/updatenote " login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    // create new note object
    const newNotes = {}
    if (title) { newNotes.title = title };
    if (description) { newNotes.description = description};
    if (tag) { newNotes.tag = tag };
    try{
    // find note to update
    let note = Notes.findById(req.params.id)
    if (!note) {
       return res.status(404).send("not found")
    }
    // if (note.user.toString() !== req.user.id) {
    //     return res.status(404).send("not found")
    // }

    note = await Notes.findByIdAndUpdate(req.params.id , {$set:newNotes},{new:true})
    res.json({note})

    
} catch (error) {
    console.log(error.message);
    res.status(500).send("something went wrong")
}

})
// Route 4
//// Delete a existing notes using post " /api/auth/deletenote " login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    // find note to deldte
    let note = Notes.findById(req.params.id)
    if (!note) {
       return res.status(404).send("not found")
    }
    // if (notes.user.toString() !== req.user.id) {
    //     return res.status(404).send("not found")
    // }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"sucess": "note delted sussesfully "})

})

module.exports = router