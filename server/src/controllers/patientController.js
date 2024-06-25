const Patient = require("../models/patientModel")
const CustomError = require("../errors");
const { StatusCodes } = require('http-status-codes')
const { calculateAge } = require('../utils/format')

const createPatient = async (req, res, next) => {
  try {
    const { nik, fullName, bornDate, gender, phone, address, medicalHistory } = req.body;

    const patientExist = await Patient.findOne({ nik });
    if (patientExist) {
      throw new CustomError.BadRequestError('Patient already exists');
    }
  
    const patient = await Patient.create({ 
      nik, 
      fullName, 
      bornDate, 
      gender, 
      contactInfo: {
        phone,
        address
      },
      medicalHistory
    });
    res.status(StatusCodes.CREATED).json({ patient });
  } catch(err) {
    next(err);
  }
}

const createVitalSign = async (req, res, next) => {
  try {
    const { heartRate, systolic, diastolic, bodyTemperature, oxygenSaturation } = req.body;
    const { id } = req.params;
    const patient = await Patient.findOne({ _id: id });

    if (!patient) {
      throw new CustomError.BadRequestError(`Patient with ID : ${id} not exists`);
    }

    patient.vitalSign = [
      ...patient.vitalSign,
      {
        heartRate, 
        bloodPressure: {
          systolic, 
          diastolic
        },
        bodyTemperature,
        oxygenSaturation,
      }
    ];
    await patient.save();

    res.status(StatusCodes.CREATED).json({ patient });
  } catch(err) {
    next(err);
  }
}

const getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 30, fullName, nik } = req.query;

    const queryObject = {};
    if (fullName) {
      queryObject.fullName = { $regex: fullName, $options: 'i' };
    }
    if (nik) {
      queryObject.nik = { $regex: nik, $options: 'i' };
    }

    const patients = await Patient.find(queryObject)
      .sort({ nik: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalPatients = await Patient.countDocuments(queryObject);
    const totalPages = Math.ceil(totalPatients / limit);

    res.status(StatusCodes.OK).json({ patients, totalPatients, totalPages, currentPage: Number(page) });
  } catch(err) {
    next(err);
  }
}

const getPatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ _id: id });
    if (!patient) {
      throw new CustomError.BadRequestError(`Patient with id : ${id} not exists`);
    }
    
    if (patient.vitalSign && patient.vitalSign.length > 0) {
      patient.vitalSign.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.status(StatusCodes.OK).json({ patient : { ...patient.toObject(), age: calculateAge(patient.bornDate) }});
  } catch(err) {
    next(err);
  }
}

module.exports = { createPatient, createVitalSign, getAllPatients, getPatient }