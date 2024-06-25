<template>
  <div class="min-h-screen bg-white-off p-8">
    <div class="container mx-auto">
      <button
        @click="goBack"
        class="mb-6 bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition duration-300"
      >
        Back to Dashboard
      </button>
      <h1 class="text-3xl font-bold mb-6 text-primary">Patient Details</h1>
      <div v-if="patient">
        <h2 class="text-2xl font-semibold mb-4">{{ patient.fullName }}</h2>
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center">
          <p class="mb-2 sm:mb-0 sm:mr-4"><strong>Age:</strong> {{ patient.age }}</p>
          <p class="mb-2 sm:mb-0 sm:mr-4 capitalize"><strong>Gender:</strong> {{ patient.gender }}</p>
        </div>
        <h3 class="text-xl font-semibold mb-2">Medical History</h3>
        <div class="overflow-x-auto mb-4">
          <table class="w-full sm:min-w-max bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead class="bg-primary text-white">
              <tr>
                <th class="p-3">Condition</th>
                <th class="p-3">Diagnosed Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="history in patient.medicalHistory" :key="history._id" class="text-center">
                <td class="p-3 border-t">{{ history.condition }}</td>
                <td class="p-3 border-t">{{ formatDate(history.diagnosedDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 class="text-xl font-semibold mb-2">Vital Signs</h3>
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center">
          <button
            @click="openModal"
            class="mb-2 sm:mb-0 border border-primary text-primary p-2 rounded-md hover:bg-primary-dark hover:text-white transition duration-300"
          >
            Add Vital Sign
          </button>
        </div>
        <Modal :isOpen="isModalOpen" title="Data Pasien" @close="closeModal">
          <form ref="vitalSignData" @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label for="heartRate" class="block text-sm font-medium text-gray-700">Heart Rate</label>
              <input
                type="text"
                id="heartRate"
                v-model="vitalSignForm.heartRate"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div class="mb-4">
              <label for="bloodPressure-s" class="block text-sm font-medium text-gray-700">Blood Pressure - Systolic</label>
              <input
                type="text"
                id="bloodPressure-s"
                v-model="vitalSignForm.systolic"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div class="mb-4">
              <label for="bloodPressure-d" class="block text-sm font-medium text-gray-700">Blood Pressure - Diastolic</label>
              <input
                type="text"
                id="bloodPressure-d"
                v-model="vitalSignForm.diastolic"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div class="mb-4">
              <label for="bodyTemperature" class="block text-sm font-medium text-gray-700">Body Temperature</label>
              <input
                type="text"
                id="bodyTemperature"
                v-model="vitalSignForm.bodyTemperature"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div class="mb-4">
              <label for="oxygenSaturation" class="block text-sm font-medium text-gray-700">Oxygen Saturation</label>
              <input
                type="text"
                id="oxygenSaturation"
                v-model="vitalSignForm.oxygenSaturation"
                class="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition duration-300"
            >
              Submit
            </button>
          </form>
        </Modal>
        <div class="overflow-x-auto">
          <table class="w-full sm:min-w-max bg-white shadow-md rounded-lg overflow-hidden">
            <thead class="bg-primary text-white">
              <tr>
                <th class="p-3">Date</th>
                <th class="p-3">Heart Rate</th>
                <th class="p-3">Blood Pressure</th>
                <th class="p-3">Body Temperature</th>
                <th class="p-3">Oxygen Saturation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vital in patient.vitalSign" :key="vital._id" class="text-center">
                <td class="p-3 border-t">{{ formatDate(vital.createdAt) }}</td>
                <td class="p-3 border-t">{{ vital.heartRate }}</td>
                <td class="p-3 border-t">{{ vital.bloodPressure.systolic }}/{{ vital.bloodPressure.diastolic }}</td>
                <td class="p-3 border-t">{{ vital.bodyTemperature }}</td>
                <td class="p-3 border-t">{{ vital.oxygenSaturation }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

interface MedicalHistory {
  _id: string;
  condition: string;
  diagnosedDate: Date;
}

interface Patient {
  _id: string;
  nik: string;
  fullName: string;
  bornDate: Date;
  age: number;
  gender: string;
  vitalSign: VitalSign[];
  medicalHistory: MedicalHistory[];
}

export default defineComponent({
  components: {
    Modal,
  },
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isModalOpen = ref<boolean>(false);
    const patient = ref<Patient | null>(null);
    const initialVitalSignForm = {
      heartRate: 0,
      systolic: 0,
      diastolic: 0,
      bodyTemperature: 0,
      oxygenSaturation: 0,
    };

    const vitalSignForm = ref({ ...initialVitalSignForm });

    const formatDate = (dateString: Date) =>{
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const fetchPatientData = async (patientId: string) => {
     await axios.get(import.meta.env.VITE_SERVER_URL + `/api/v1/patient/${patientId}`).then((response) => {
      patient.value = response.data.patient;
    });
    };

    const handleSubmit = async (): Promise<void> => {
      axios.post(import.meta.env.VITE_SERVER_URL + `/api/v1/patient/${patient.value?._id}/vs`, vitalSignForm.value)
        .then(() => {
          console.log('Vital Sign form:', vitalSignForm.value);
          Object.assign(vitalSignForm, initialVitalSignForm);
          closeModal();
          location.reload();
        })
        .catch((error) => {
          console.error('Error submitting vital sign data:', error.response.data.message);
          alert(error.response.data.message);
        });
    };

    const goBack = () => {
      router.push('/dashboard');
    };

    const openModal = (): void => {
      isModalOpen.value = true;
    };

    const closeModal = (): void => {
      isModalOpen.value = false;
    };

    onMounted(() => {
      const patientId = route.params.id as string;
      fetchPatientData(patientId);
    });

    return {
      isModalOpen,
      vitalSignForm,
      patient,
      handleSubmit,
      formatDate,
      goBack,
      openModal,
      closeModal,
    };
  },
});
</script>