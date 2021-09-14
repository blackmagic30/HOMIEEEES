const Group = require('../Models/groupModel');
const Chat = require('../Models/ChatModel');

exports.getAllGroups = async (req, res) => {
    await Group.find().exec((error, result) => {
        if (error) {
            res.status(404).json({ errorMessage: 'No Groups found' })
        } else {
            res.status(200).json(result);
        }
    })
}

exports.getGroupById = async (req, res) => {
    await Group.findOne({_id: req.params.id}).exec((error, result) => {
        if (error) {
            res.status(404).json({ errorMessage: 'No Group found' })
        } else {
            res.status(200).json(result);
        }
    })
}

exports.updateGroup = async (req, res) => {
    const group = await Group.findOne({_id: req.params.id});
    if(group) {
        group.group = req.body.group
        group.members = req.body.selectedMembers
        const saveGroup = await group.save();
        if (saveGroup) {
          return res.status(200).json({successMessage: 'Group updated.'});
      } else {
          return res.status(400).json({ errorMessage: 'error in group update' });
      }
    }
      else {
          res.status(404).json({errorMessage: 'No group found'});
      }
}

exports.createGroup = async (req, res) => {
    
      const group = new Group({
          group: req.body.group,
          createdBy: req.user._id,
          members: req.body.selectedMembers
      });
      const saveGroup = await group.save();
      if (saveGroup) {
        return res.status(200).json({successMessage: 'Group created.'});
    } else {
        return res.status(400).json({ errorMessage: 'error in group creation' });
    }
}

exports.deleteGroup = async (req, res) => {
    await Group.findOne({_id: req.params.id}).exec((error, result) => {
        if (error) {
            res.status(404).json({ errorMessage: 'No Group found' })
        } else {
            Chat.find({group: req.params.id}).remove().exec((error, data) => {
                if(data) {
                    console.log(data)
                }
            })
            result.remove();
            res.status(200).json( {successMessage: 'Group deleted.'} );
        }
    })
}