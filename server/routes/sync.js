var express = require('express');
var router = express.Router();
const {applyActionsToStore} = require('../functions');

router.post('/', async (req, res)=>{
    const action = req.body;
    const user_id = req.headers.user;
    const project_id = req.headers.project;
    const state = await applyActionsToStore([action], user_id, project_id);
    res.send(state);

});

module.exports = router;
