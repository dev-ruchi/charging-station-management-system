<template>
  <div class="container mx-auto px-4 py-8">
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

    <!-- Station Details -->
    <div v-else class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <div class="flex items-center gap-4">
            <button 
              @click="router.push('/stations')"
              class="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Stations
            </button>
            <h1 class="text-3xl font-bold text-gray-900">{{ station.name }}</h1>
          </div>
          <div class="mt-2">
            <span
              :class="{
                'px-3 py-1 text-sm rounded-full font-medium': true,
                'bg-green-100 text-green-800': station.status === 'Active',
                'bg-red-100 text-red-800': station.status === 'Inactive'
              }"
            >
              {{ station.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Map Section -->
        <div class="h-64 relative">
          <l-map
            v-model="zoom"
            v-model:zoom="zoom"
            :center="[station.location.latitude, station.location.longitude]"
            :use-global-leaflet="false"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            />
            <l-marker
              :lat-lng="[station.location.latitude, station.location.longitude]"
            >
              <l-popup>
                <div class="p-2">
                  <h3 class="font-semibold text-gray-900">{{ station.name }}</h3>
                  <p class="text-sm text-gray-600">{{ station.location.address }}</p>
                  <div class="mt-2 flex items-center space-x-2">
                    <span
                      :class="{
                        'px-2 py-0.5 text-xs rounded-full': true,
                        'bg-green-100 text-green-800': station.status === 'Active',
                        'bg-red-100 text-red-800': station.status === 'Inactive'
                      }"
                    >
                      {{ station.status }}
                    </span>
                    <span class="text-sm text-gray-600">{{ station.powerOutput }}kW</span>
                  </div>
                </div>
              </l-popup>
            </l-marker>
          </l-map>
        </div>

        <!-- Details Section -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Location Details -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900">Location Details</h2>
              <div class="space-y-2">
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Address</p>
                    <p class="text-sm text-gray-500">{{ station.location.address }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Coordinates</p>
                    <p class="text-sm text-gray-500">
                      Latitude: {{ station.location.latitude }}<br>
                      Longitude: {{ station.location.longitude }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900">Technical Details</h2>
              <div class="space-y-2">
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Power Output</p>
                    <p class="text-sm text-gray-500">{{ station.powerOutput }} kW</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Connector Type</p>
                    <p class="text-sm text-gray-500">{{ station.connectorType }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex justify-end space-x-4" v-if="canManageStation(station)">
            <button
              @click="router.push(`/stations/${station._id}/edit`)"
              class="inline-flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Station
            </button>
            <button
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Station
            </button>
          </div>
        </div>
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
        <p class="text-gray-500 mb-6">
          Are you sure you want to delete <span class="font-medium text-gray-900">{{ station.name }}</span>? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { stationService } from '../services/station.service';
import { authService } from '../services/api';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';

const router = useRouter();
const route = useRoute();
const station = ref({
  name: '',
  location: {
    address: '',
    latitude: 0,
    longitude: 0,
  },
  status: '',
  powerOutput: 0,
  connectorType: '',
  createdBy: null,
});
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const deleting = ref(false);
const zoom = ref(15); // Closer zoom for single station view

// Get current user
const currentUser = authService.getCurrentUser();

// Check if user can manage (edit/delete) a station
const canManageStation = (station) => {
  if (!currentUser || !station.createdBy) return false;
  const creatorId = typeof station.createdBy === 'object' ? station.createdBy._id : station.createdBy;
  return creatorId === currentUser.id;
};

const fetchStation = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await stationService.getStationById(route.params.id);
    station.value = response.data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load station details';
    if (err.response?.status === 404) {
      router.push('/stations');
    }
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    deleting.value = true;
    await stationService.deleteStation(station.value._id);
    router.push('/stations');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to delete station';
    showDeleteModal.value = false;
  } finally {
    deleting.value = false;
  }
};

onMounted(fetchStation);
</script>

<style>
@import 'leaflet/dist/leaflet.css';
</style> 