<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Charging Stations Map</h1>
      <button
        @click="router.push('/stations')"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        List View
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

    <!-- Map Container -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="h-[calc(100vh-12rem)]">
        <l-map
          v-model="zoom"
          v-model:zoom="zoom"
          :center="center"
          :use-global-leaflet="false"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
          <l-marker
            v-for="station in stations"
            :key="station._id"
            :lat-lng="[station.location.latitude, station.location.longitude]"
            @click="handleMarkerClick(station)"
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
                <button
                  @click="router.push(`/stations/${station._id}`)"
                  class="mt-2 w-full px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  View Details
                </button>
              </div>
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { stationService } from '../services/station.service';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';

const router = useRouter();
const stations = ref([]);
const loading = ref(true);
const error = ref(null);
const zoom = ref(13);
const center = ref([0, 0]); // Will be updated when stations are loaded

const fetchStations = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await stationService.getAllStations();
    stations.value = response.data || [];
    
    // Set map center to the first station or default location
    if (stations.value.length > 0) {
      const firstStation = stations.value[0];
      center.value = [firstStation.location.latitude, firstStation.location.longitude];
    } else {
      // Default to a central location if no stations
      center.value = [51.505, -0.09]; // London coordinates as default
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load charging stations';
  } finally {
    loading.value = false;
  }
};

const handleMarkerClick = (station) => {
  // This is handled by the popup now
  console.log('Marker clicked:', station.name);
};

onMounted(() => {
  fetchStations();
});
</script>

<style>
@import 'leaflet/dist/leaflet.css';
</style> 