<template>
  <div class="min-h-screen bg-white-off p-8">
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-primary">Dashboard</h1>
      <div class="mb-6">
        <label for="search" class="block text-sm font-medium text-gray-700">Search Patient</label>
        <div class="flex">
          <input
            type="text"
            id="search"
            v-model="searchQuery"
            placeholder="Enter patient name"
            class="mt-1 p-2 w-full border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            @click="handleSearch"
            class="mt-1 bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark transition duration-300"
          >
            Search
          </button>
        </div>
      </div>
      <button
        @click="openModal"
        class="bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition duration-300"
      >
        Buat Data Pasien
      </button>
      <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-4">Patients</h2>
        <ul>
          <li v-for="patient in patients" :key="patient._id" class="mb-2">
            <router-link :to="'/patient/' + patient._id" class="text-primary hover:underline">{{ patient.nik }} - {{ patient.fullName }}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <Modal :isOpen="isModalOpen" title="Data Pasien" @close="closeModal">
      <form ref="patientData" @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="nik" class="block text-sm font-medium text-gray-700">NIK</label>
          <input
            type="text"
            id="nik"
            v-model="patientForm.nik"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div class="mb-4">
          <label for="fullName" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="name"
            id="fullName"
            v-model="patientForm.fullName"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div class="mb-4">
          <label for="born-date" class="block text-sm font-medium text-gray-700">Born Date</label>
          <input
            type="date"
            id="born-date"
            v-model="patientForm.bornDate"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div class="mb-4">
          <label for="gender" class="block text-sm font-medium text-gray-700">Sex</label>
          <select
            id="gender"
            v-model="patientForm.gender"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            v-model="patientForm.phone"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div class="mb-4">
          <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            v-model="patientForm.address"
            class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-700">Medical History</h3>
          <div v-if="showMedicalHistoryForm">

            <div v-for="(history, index) in patientForm.medicalHistory" :key="index" class="mb-4">
              <div class="mb-2">
                <label :for="'condition-' + index" class="block text-sm font-medium text-gray-700">Condition</label>
                <input
                type="text"
                :id="'condition-' + index"
                v-model="history.condition"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label :for="'diagnosed-date-' + index" class="block text-sm font-medium text-gray-700">Diagnosed Date</label>
              <input
                type="date"
                :id="'diagnosed-date-' + index"
                v-model="history.diagnosedDate"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                />
              </div>
              <button @click="removeMedicalHistory(index)" class="mt-2 text-red-500 hover:underline">Remove</button>
            </div>
          </div>
          <button @click="addMedicalHistory" class="mt-2 border border-primary text-primary p-2 rounded-md hover:bg-primary-dark hover:text-white transition duration-300">Add Medical Condition</button>
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition duration-300"
        >
          Submit
        </button>
      </form>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import Modal from '../components/FormModal.vue';

interface VitalSign {
  _id: string;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bodyTemperature: number;
  oxygenSaturation: number;
  createdAt: Date;
}

interface Patient {
  _id: string;
  nik: string;
  fullName: string;
  bornDate: Date;
  gender: string;
  vitalSign: VitalSign[];
  medicalHistory: MedicalHistory[];
}

interface MedicalHistory {
  condition: string;
  diagnosedDate: Date;
}

export default defineComponent({
  components: {
    Modal,
  },

  setup() {
    const searchQuery = ref<string>('');
    const isModalOpen = ref<boolean>(false);
    const showMedicalHistoryForm = ref(false);
    const initialPatientForm = {
      nik: '',
      fullName: '',
      bornDate: new Date(),
      gender: '',
      phone: '',
      address: '',
      medicalHistory: [] as MedicalHistory[],
    };
    const patients = ref<Patient[]>([]);

    const patientForm = ref({ ...initialPatientForm });

    const handleSearch = (): void => {
      fetchPatientData(searchQuery.value);
    };

    const openModal = (): void => {
      isModalOpen.value = true;
    };

    const closeModal = (): void => {
      isModalOpen.value = false;
    };

    const fetchPatientData = async (fullName : string): Promise<void> => {
      try {
        const response = await axios.get<{ patients: Patient[] }>(import.meta.env.VITE_SERVER_URL + `/api/v1/patient?fullName=${fullName}`);
        patients.value = response.data.patients;
        
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    const handleSubmit = async (): Promise<void> => {
      await axios.post(import.meta.env.VITE_SERVER_URL + '/api/v1/patient', patientForm.value)
        .then(() => {
          Object.assign(patientForm, initialPatientForm);
          closeModal();
        })
        .catch((error) => {
          console.error('Error submitting patient data:', error.response.data.message);
          alert(error.response.data.message);
        }); 
    };

    const addMedicalHistory = (): void => {
      showMedicalHistoryForm.value = true;
      patientForm.value.medicalHistory.push({
        condition: '',
        diagnosedDate: new Date(),
      });
    };

    const removeMedicalHistory = (index: number): void => {
      patientForm.value.medicalHistory.splice(index, 1);
      if (patientForm.value.medicalHistory.length === 0) {
        showMedicalHistoryForm.value = false;
      }
    };

    onMounted(() => {
      fetchPatientData(searchQuery.value);
    });

    return {
      searchQuery,
      isModalOpen,
      showMedicalHistoryForm,
      patientForm,
      patients,
      handleSearch,
      openModal,
      closeModal,
      handleSubmit,
      addMedicalHistory,
      removeMedicalHistory,
    };
  },
});
</script>