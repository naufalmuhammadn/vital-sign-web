const express = require('express');
const { createPatient, createVitalSign, getPatient, getAllPatients } = require('../controllers/patientController');

const router = express.Router();

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatient);
router.post("/:id/vs", createVitalSign);

module.exports = router;