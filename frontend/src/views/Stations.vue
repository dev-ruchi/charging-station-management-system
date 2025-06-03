<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Charging Stations</h1>
      <button
        @click="openCreateModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add New Station
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <!-- Success State -->
    <div
      v-if="successMessage"
      class="fixed top-4 right-4 bg-green-50 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center z-50"
    >
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {{ successMessage }}
    </div>

    <!-- Stations List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="station in stations"
        :key="station._id"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold text-gray-900">{{ station.name }}</h2>
          <span
            :class="{
              'px-2 py-1 text-sm rounded-full': true,
              'bg-green-100 text-green-800': station.status === 'Active',
              'bg-red-100 text-red-800': station.status === 'Inactive'
            }"
          >
            {{ station.status }}
          </span>
        </div>

        <div class="space-y-2 text-gray-600">
          <p class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ station.location.address }}
          </p>
          <p class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ station.powerOutput }}kW
          </p>
          <p class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            {{ station.connectorType }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 flex justify-end space-x-2">
          
          <button
            v-if="canManageStation(station)"
            @click="editStation(station)"
            class="inline-flex items-center px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            v-if="canManageStation(station)"
            @click="confirmDelete(station)"
            class="inline-flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Station Form Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingStation ? 'Edit Station' : 'Add New Station' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="stationForm.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter station name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input
              v-model="stationForm.location.address"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter station address"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                v-model.number="stationForm.location.latitude"
                type="number"
                step="any"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. 51.5074"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                v-model.number="stationForm.location.longitude"
                type="number"
                step="any"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. -0.1278"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
            <input
              v-model.number="stationForm.powerOutput"
              type="number"
              required
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. 50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Connector Type</label>
            <select
              v-model="stationForm.connectorType"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a connector type</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="CCS">CCS</option>
              <option value="Tesla Supercharger">Tesla Supercharger</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="stationForm.status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div class="bg-red-100 rounded-full p-2 mr-3">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Delete Station</h3>
        </div>
        <p class="text-gray-500 mb-6">Are you sure you want to delete <span class="font-medium text-gray-900">{{ stationToDelete?.name }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            @click="deleteSelectedStation"
            :disabled="deleting"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <svg
              v-if="deleting"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ deleting ? 'Deleting...' : 'Delete Station' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { stationService } from '../services/station.service';
import { authService } from '../services/api';
import { useRouter } from 'vue-router';

// State
const stations = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const showDeleteModal = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const editingStation = ref(null);
const stationToDelete = ref(null);
const router = useRouter();
const successMessage = ref('');

// Get current user
const currentUser = computed(() => {
  const user = authService.getCurrentUser();
  console.log('Current user:', user);
  return user;
});

// Check if user can manage (edit/delete) a station
const canManageStation = (station) => {
  console.log('Checking station:', station);
  console.log('Current user:', currentUser.value);

  if (!currentUser.value) {
    console.log('No current user found');
    return false;
  }

  if (!station.createdBy) {
    console.log('No createdBy field in station');
    return false;
  }

  // Get the creator ID, handling both object and string formats
  const creatorId = typeof station.createdBy === 'object' ? station.createdBy._id : station.createdBy;
  const userId = currentUser.value.id;

  console.log('Creator ID:', creatorId);
  console.log('User ID:', userId);
  console.log('Types - Creator ID:', typeof creatorId, 'User ID:', typeof userId);
  console.log('Comparison result:', creatorId === userId);

  return creatorId === userId;
};

// Methods
const fetchStations = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await stationService.getAllStations();
    console.log('Fetched stations:', response);
    stations.value = response.data || [];
    
    // Log each station's createdBy field
    stations.value.forEach((station, index) => {
      console.log(`Station ${index + 1} createdBy:`, station.createdBy);
    });
  } catch (err) {
    handleError(err, 'Failed to load charging stations');
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    submitting.value = true;
    error.value = null;

    const formData = {
      ...stationForm.value,
      location: {
        ...stationForm.value.location,
        latitude: parseFloat(stationForm.value.location.latitude),
        longitude: parseFloat(stationForm.value.location.longitude),
      },
      powerOutput: parseFloat(stationForm.value.powerOutput),
    };

    if (editingStation.value) {
      await stationService.updateStation(editingStation.value._id, formData);
      showSuccessMessage('Station updated successfully');
    } else {
      await stationService.createStation(formData);
      showSuccessMessage('Station created successfully');
    }
    
    await fetchStations();
    closeModal();
  } catch (err) {
    handleError(err, 'Failed to save charging station');
  } finally {
    submitting.value = false;
  }
};

const editStation = (station) => {
  editingStation.value = station;
  stationForm.value = {
    name: station.name,
    location: {
      address: station.location.address,
      latitude: station.location.latitude,
      longitude: station.location.longitude,
    },
    powerOutput: station.powerOutput,
    connectorType: station.connectorType,
    status: station.status
  };
  showModal.value = true;
};

const deleteSelectedStation = async () => {
  try {
    deleting.value = true;
    error.value = null;
    
    await stationService.deleteStation(stationToDelete.value._id);
    showSuccessMessage('Station deleted successfully');
    await fetchStations();
    showDeleteModal.value = false;
    stationToDelete.value = null;
  } catch (err) {
    handleError(err, 'Failed to delete charging station');
  } finally {
    deleting.value = false;
  }
};

const handleError = (err, defaultMessage) => {
  console.error('Operation error:', err);
  if (err.response?.status === 403) {
    error.value = 'You are not authorized to perform this action';
  } else if (err.response?.status === 401) {
    router.push('/login');
  } else {
    error.value = err.response?.data?.message || defaultMessage;
  }
};

const showSuccessMessage = (message) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

const closeModal = () => {
  showModal.value = false;
  editingStation.value = null;
  error.value = null;
  resetForm();
};

const resetForm = () => {
  stationForm.value = {
    name: '',
    location: {
      address: '',
      latitude: null,
      longitude: null,
    },
    powerOutput: null,
    connectorType: '',
    status: 'Active'
  };
};

const confirmDelete = (station) => {
  stationToDelete.value = station;
  showDeleteModal.value = true;
};

const openCreateModal = () => {
  editingStation.value = null;
  resetForm();
  showModal.value = true;
};

// Initialize form state
const stationForm = ref({
  name: '',
  location: {
    address: '',
    latitude: null,
    longitude: null,
  },
  powerOutput: null,
  connectorType: '',
  status: 'Active'
});

// Lifecycle
onMounted(() => {
  fetchStations();
  // Add event listener for escape key to close modals
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      showDeleteModal.value = false;
    }
  };
  window.addEventListener('keydown', handleEscape);
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});
</script> 