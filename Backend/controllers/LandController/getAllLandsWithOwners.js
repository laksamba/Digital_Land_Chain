
import express from "express";
import Land from "../../models/Land.js";




export const getAllLandsWithOwners =  async (req, res) => {
  try {
    // const { userId } = req.params;
    const lands = await Land.find().populate("owner");
    console.log(" All lands with owner info:", lands);

    res.status(200).json(lands);
  } catch (err) {
    console.error(" Error fetching all lands:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
