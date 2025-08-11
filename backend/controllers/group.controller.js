const Group = require("../models/group.model");
const User = require("../models/user.model");


exports.createGroup = async (req, res) => {
    try {
      const { name, description, members, createdBy } = req.body; 
      console.log(createdBy);
      const users = await User.find({ email: { $in: members } });
  
      const memberIds = users.map(user => user._id);

      const group = new Group({ name, description, members: memberIds, createdBy });
      await group.save();
      console.log(15341545410);
  
      res.status(201).json({ success: true, message: "Group created successfully", group });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

exports.getGroupMembers = async (req, res) => {
    try {
      console.log("requested this ");
      const { groupId } = req.params;
  
      const group = await Group.findById(groupId).populate("members", "name email");
  
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
  
      res.status(200).json({ members: group.members });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };



exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("createdBy", "name").populate("members", "name");
    res.status(200).json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("members", "name");

    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateGroup = async (req, res) => {
  try {
    const { name, description, members, groupId } = req.body;
    console.log(req.body);
    const users = await User.find({ email: { $in: members } }).select('_id');

    const memberIds = users.map(user => user._id);
    console.log("members",memberIds)
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name, description, members: memberIds },
      { new: true, runValidators: true }
    );

    // console.log("updates",updatedGroup);
    if (!updatedGroup) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      updatedGroup
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);

    if (!deletedGroup) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    res.status(200).json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGroupsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const groups = await Group.find({
      $or: [{ createdBy: userId }, { members: userId }]
    })
      .populate("createdBy", "name")
      .populate("members", "name");

    if (!groups.length) {
      return res.status(404).json({ success: false, message: "No groups found for this user" });
    }

    res.status(200).json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};