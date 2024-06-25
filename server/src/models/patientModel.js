const mongoose = require('mongoose')

const ContactInfoSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  }
})

const MedicalHistorySchema = new mongoose.Schema({
  condition: { 
    type: String, 
    required: true 
  },
  diagnosedDate: { 
    type: Date, 
    required: true 
  }
});

const VitalSignSchema = new mongoose.Schema({
  heartRate: { 
    type: Number, 
    required: true 
  },
  bloodPressure: {
    systolic: { 
      type: Number, 
      required: true 
    },
    diastolic: { 
      type: Number, 
      required: true 
    }
  },
  bodyTemperature: { 
    type: Number, 
    required: true 
  },
  oxygenSaturation: { 
    type: Number, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: new Date().getTime(),
    required: true
  }
})

const PatientSchema = new mongoose.Schema({
  nik: { 
    type: String,
    required: true,
    unique: true
   },
  fullName: { 
    type: String,
    required: true,
    minlength: 4,
    maxlength: 64,
    unique: false 
  },
  bornDate: {
    type: Date,
    required: true 
  },
  gender: { 
    type: String, 
    required: true 
  },
  contactInfo: { 
    type: ContactInfoSchema, 
    required: true 
  },
  medicalHistory: [MedicalHistorySchema],
  vitalSign: [VitalSignSchema],
  createdAt: { 
    type: Date, 
    default: new Date().getTime(),
    required: true 
  },
  updatedAt: { 
    type: Date, 
    default: new Date().getTime() 
  },
})

module.exports = mongoose.model("Patient", PatientSchema)