<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSignup">
          <!-- Error Alert -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
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

          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div class="mt-2">
              <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                placeholder="Enter your username"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div class="mt-2">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                placeholder="Enter your email"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
            <div class="mt-2">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading ? "Creating account..." : "Sign up" }}
            </button>
          </div>

          <div class="text-sm text-center">
            <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/api";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleSignup = async () => {
  try {
    loading.value = true;
    error.value = ""; // Clear any previous errors

    const data = await authService.signup({
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // Store the token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.savedUser));

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err) {
    console.error("Signup error:", err);
    error.value = err.response?.data?.error || err.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script> 