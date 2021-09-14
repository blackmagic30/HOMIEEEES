const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    group: {
        type: String,
        require: true,
    },
    createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     },
     members: {
         type: Array,
         default: []
     }
}, {timestamps: true}
);

const groupModel = new mongoose.model('Group', groupSchema);
module.exports = groupModel;
