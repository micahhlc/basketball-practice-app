<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Practice Session</h1>

    <!-- Set Practice Goal -->
    <div
      class="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg shadow-md"
    >
      <label for="goal" class="block text-lg font-medium text-blue-800"
        >Set Practice Goal:</label
      >
      <input
        v-model.number="goal"
        id="goal"
        type="number"
        class="border border-gray-400 p-2 w-full rounded-md mt-2 text-lg text-center"
      />
    </div>

    <!-- Progress Display -->
    <div
      class="mb-4 text-lg flex justify-between items-center bg-gray-100 p-3 rounded-md"
    >
      <p>
        Progress: <strong>{{ totalShots }} / {{ goal }}</strong>
      </p>
      <p>
        Makes: <strong class="text-green-600">{{ totalMakes + makes }}</strong>
      </p>
      <p>
        Total Shots: <strong class="text-red-600">{{ totalShots }}</strong>
      </p>
      
      <p>
        Make %: <strong>{{ makePercentage }}%</strong>
      </p>
    </div>

    <!-- Live Make & Miss Counter -->
    <div class="mb-4 text-lg flex justify-center gap-6">
      <button
        @click="logMake"
        class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
      >
        Make
      </button>
      <p class="text-green-600 px-4 py-2 font-bold">{{ makes }}</p>
      <button
        @click="logMiss"
        class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md"
      >
        Miss
      </button>
      <p class="text-red-600 px-4 py-2 font-bold">{{ misses }}</p>
      <span class="text-black-600 px-4 py-2 font-bold">Total shots: </span>
      <span class="text-black-400 px-4 py-2 font-bold">{{ makes + misses }}</span>
    </div>

    <!-- Log Round Button -->
    <div class="mt-4">
      <button
        @click="logRound"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md w-full"
      >
        Log Round
      </button>
    </div>

    <!-- Round Summary -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Rounds:</h2>
      <ul>
        <li
          v-for="(round, index) in rounds"
          :key="index"
          class="border border-gray-300 p-4 mb-2 rounded-lg shadow-sm bg-gray-100"
        >
          <!-- First Row: Round Info & Buttons -->
          <div class="flex justify-between items-center">
            <!-- Left Side: Round Info -->
            <div>
              <strong>Round {{ index + 1 }}: </strong>
              <span class="text-green-600 font-semibold">
                {{ round.makes }}
              </span>
              /
              <span class="font-bold">
                {{ round.makes + round.misses }}
              </span>
            </div>

            <!-- Right Side: Edit & Delete Buttons -->
            <div class="flex gap-2">
              <button
                @click="editRound(index)"
                class="px-3 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                @click="deleteRound(index)"
                class="px-3 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Second Row (Only Shown When Editing) -->
          <div
            v-if="editingIndex === index"
            class="mt-2 flex items-center gap-2"
          >
            <input
              v-model.number="round.makes"
              type="number"
              min="0"
              class="border px-3 py-1 rounded w-16 text-center"
            />
            <input
              v-model.number="round.misses"
              type="number"
              min="0"
              class="border px-3 py-1 rounded w-16 text-center"
            />
            <div class="flex gap-2">
              <button
                @click="saveEdit"
                class="px-3 py-1 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Data
const goal = ref(200);
const totalShots = ref(0);
const makes = ref(0);
const misses = ref(0);
const rounds = ref([]);
const editingIndex = ref(null);

// Computed Properties
const totalMakes = computed(() => rounds.value.reduce((sum, round) => sum + round.makes, 0));
const totalMisses = computed(() => rounds.value.reduce((sum, round) => sum + round.misses, 0));
const makePercentage = computed(() => {
  if (totalShots.value === 0) return 0;
  return (((totalMakes.value + makes.value) / totalShots.value) * 100).toFixed(1);
});


// Functions for Local Storage
// Function to load rounds from Local Storage
const loadFromLocalStorage = () => {
  const storedRounds = localStorage.getItem("practiceRounds");
  const storedTotalShots = localStorage.getItem("totalShots");

  if (storedRounds) {
    rounds.value = JSON.parse(storedRounds);
  }
  if (storedTotalShots) {
    totalShots.value = parseInt(storedTotalShots);
  }
};
// Load data when the component is mounted
loadFromLocalStorage();

// Function to save rounds to Local Storage
const saveToLocalStorage = () => {
  localStorage.setItem("practiceRounds", JSON.stringify(rounds.value));
  localStorage.setItem("totalShots", totalShots.value);
};

// Functions
const logMake = () => {
  makes.value++;
  totalShots.value++;
};

const logMiss = () => {
  misses.value++;
  totalShots.value++;
};

// Update logRound function to save after logging a round
const logRound = () => {
  if (makes.value === 0 && misses.value === 0) {
    alert("You haven't taken any shots in this round!");
    return;
  }

  // Add new round to list
  rounds.value.push({ makes: makes.value, misses: misses.value });

  // Recalculate total shots based on all rounds
  totalShots.value = rounds.value.reduce((sum, round) => sum + round.makes + round.misses, 0);

  // Reset for next round
  makes.value = 0;
  misses.value = 0;

  // Save to Local Storage
  saveToLocalStorage();
};

const editRound = (index) => {
  editingIndex.value = index;
};

const saveEdit = () => {
  if (editingIndex.value !== null) {
    totalShots.value = rounds.value.reduce((sum, round) => sum + round.makes + round.misses, 0);

    editingIndex.value = null;

    saveToLocalStorage();
  }
};

const cancelEdit = () => {
  editingIndex.value = null;
};

// Update deleteRound function to save after deleting a round
const deleteRound = (index) => {
  rounds.value.splice(index, 1);

  if (rounds.value.length === 0) {
    totalShots.value = 0;
  } else {
    totalShots.value = rounds.value.reduce((sum, round) => sum + round.makes + round.misses, 0);
  }

  // Save to Local Storage
  saveToLocalStorage();
};
</script>
