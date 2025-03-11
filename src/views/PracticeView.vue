<template>
  <div class="p-4 pb-20">
    <h1 class="mb-4 text-2xl font-bold">Practice Session</h1>

    <!-- Set Practice Goal -->
    <div
      class="mb-4 flex items-center justify-between rounded-lg border border-blue-300 bg-blue-100 p-2 shadow-md"
    >
      <!-- Left: Input Field & Set Button -->
      <div class="flex items-center gap-2">
        <label for="goal" class="text-lg font-medium text-blue-800">
          Set Practice Goal:
        </label>
        <input
          v-model.number="goal"
          id="goal"
          type="number"
          class="w-20 rounded-md border border-gray-400 p-1 text-center text-lg"
          :disabled="!goalEditable"
          :class="{
            'cursor-not-allowed bg-gray-200 opacity-50': !goalEditable,
          }"
        />
        <button
          @click="toggleGoalLock"
          class="rounded px-2 py-1 shadow-md"
          :class="
            goalEditable ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          "
        >
          {{ goalEditable ? "Lock" : "Set" }}
        </button>
      </div>

      <!-- Right: Reach Goal Indicator -->
      <div class="text-lg font-semibold text-blue-900">
        <span :class="goalReached ? 'text-green-600' : 'text-red-600'">
          {{ goalReached ? "Yes 🎯" : "No ❌" }}
        </span>
      </div>
    </div>

    <!-- Progress Display -->
    <div
      class="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-3 text-lg"
    >
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

    <!-- Toggle Button for Switching Modes -->
    <div class="mt-4 flex justify-center">
      <button
        @click="toggleBulkMode"
        class="w-full rounded-lg bg-gray-500 px-4 py-2 text-white shadow-md"
      >
        {{ isBulkMode ? "Switch to Live Mode" : "Switch to Bulk Input" }}
      </button>
    </div>

    <!-- Shared Input Area (Switches Between Live & Bulk Mode) -->
    <div class="mt-4 rounded-lg border border-gray-300 bg-gray-100 p-4">
      <label class="block text-lg font-medium">
        {{ isBulkMode ? "Bulk Input Mode" : "Live Mode" }}
      </label>

      <!-- Live Mode (Shown When isBulkMode is False) -->
      <div v-if="!isBulkMode" class="mt-2 flex justify-center gap-4">
        <button
          @click="logMake"
          class="rounded-lg bg-green-500 px-2 py-2 text-white shadow-md"
        >
          Make
        </button>
        <p class="px-1 py-2 font-bold text-green-600">{{ makes }}</p>
        <button
          @click="logMiss"
          class="rounded-lg bg-red-500 px-2 py-2 text-white shadow-md"
        >
          Miss
        </button>
        <p class="px-1 py-2 font-bold text-red-600">{{ misses }}</p>
        <span class="text-black-600 px-1 py-2 font-bold">Total </span>
        <span class="text-black-200 px-1 py-2 font-bold">{{
          makes + misses
        }}</span>
      </div>

      <!-- Bulk Input Mode (Shown When isBulkMode is True) -->
      <div v-if="isBulkMode" class="mt-2 flex gap-4">
        <span class="px-2 py-2 font-bold text-green-600">Makes</span>
        <input
          v-model.number="bulkMakes"
          type="number"
          placeholder="Total Makes"
          class="w-1/2 rounded border p-1 text-center"
        />
        <span class="px-2 py-2 font-bold">Total</span>
        <input
          v-model.number="bulkTotalShots"
          type="number"
          placeholder="Total Shots"
          class="w-1/2 rounded border p-1 text-center"
        />
      </div>

      <!-- Log Button (Works for Both Modes) -->
      <button
        @click="isBulkMode ? logBulkRound() : logRound()"
        class="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md"
      >
        Log Round
      </button>
    </div>

    <!-- Save Message -->
    <div v-if="saveMessage" class="p-2 text-center font-bold text-green-600">
      {{ saveMessage }}
    </div>

    <!-- Save Practice Session Button -->
    <div class="mt-4 flex justify-center">
      <button
        @click="savePracticeSession"
        class="w-full rounded-lg bg-green-500 px-4 py-2 text-white shadow-md"
      >
        Save Practice Session
      </button>
    </div>

    <!-- Round Summary -->
    <div class="mt-6">
      <h2 class="mb-2 text-xl font-semibold">Rounds:</h2>
      <ul>
        <li
          v-for="(round, index) in rounds"
          :key="index"
          class="mb-2 rounded-lg border border-gray-300 bg-gray-100 p-4 shadow-sm"
        >
          <!-- First Row: Round Info & Buttons -->
          <div class="flex items-center justify-between">
            <!-- Left Side: Round Info -->
            <div>
              <strong>Round {{ index + 1 }}: </strong>
              <span class="font-semibold text-green-600">
                {{ round.makes }}
              </span>
              /
              <span class="font-bold">
                {{ round.makes + round.misses }}
              </span>
              <span class="px-2 font-bold">
                {{
                  ((round.makes / (round.makes + round.misses)) * 100).toFixed(
                    1,
                  )
                }}%
              </span>
            </div>

            <!-- Right Side: Edit & Delete Buttons -->
            <div class="flex gap-2">
              <button
                @click="editRound(index)"
                class="rounded-md border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                @click="deleteRound(index)"
                class="rounded-md border border-red-600 px-3 py-1 text-red-600 hover:bg-red-100"
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
              class="w-16 rounded border px-3 py-1 text-center"
            />
            <input
              v-model.number="round.misses"
              type="number"
              min="0"
              class="w-16 rounded border px-3 py-1 text-center"
            />
            <div class="flex gap-2">
              <button
                @click="saveEdit"
                class="rounded bg-green-500 px-3 py-1 text-white"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="rounded bg-gray-500 px-3 py-1 text-white"
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
const isBulkMode = ref(true);
const bulkMakes = ref(0);
const bulkTotalShots = ref(0);
const goalEditable = ref(true);
const practiceSessions = ref([]); // Stores all completed practice sessions
const saveMessage = ref(""); // Stores the success message

// Toggle between Live Mode and Bulk Mode
const toggleBulkMode = () => {
  isBulkMode.value = !isBulkMode.value;
};
const toggleGoalLock = () => {
  // Toggle only if no rounds have been logged
  if (rounds.value.length === 0) {
    goalEditable.value = !goalEditable.value;
  }
};

// Computed Properties
const totalMakes = computed(() =>
  rounds.value.reduce((sum, round) => sum + round.makes, 0),
);
const totalMisses = computed(() =>
  rounds.value.reduce((sum, round) => sum + round.misses, 0),
);
const makePercentage = computed(() => {
  if (totalShots.value === 0) return 0;
  return (((totalMakes.value + makes.value) / totalShots.value) * 100).toFixed(
    1,
  );
});
const goalReached = computed(() => totalShots.value >= goal.value);

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
const setGoal = () => {
  if (goal.value > 0) {
    goalLocked.value = true;
  }
};

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
    saveMessage.value = "You haven't taken any shots in this round!";
    setTimeout(() => (saveMessage.value = ""), 3000); // Clear after 3 sec
    return;
  }

  // Add new round to list
  rounds.value.push({ makes: makes.value, misses: misses.value });

  // Recalculate total shots based on all rounds
  totalShots.value = rounds.value.reduce(
    (sum, round) => sum + round.makes + round.misses,
    0,
  );

  // Reset for next round
  makes.value = 0;
  misses.value = 0;

  // Lock goal after first round is logged
  goalEditable.value = false;

  // Save to Local Storage
  saveToLocalStorage();
};

// Log Round in Bulk Mode
const logBulkRound = () => {
  if (bulkMakes.value >= bulkTotalShots.value) {
    saveMessage.value = "Total Makes cannot be greater than Total Shots!";
    setTimeout(() => (saveMessage.value = ""), 3000); // Clear after 3 sec
    return;
  }

  // Auto-calculate Misses
  const bulkMisses = bulkTotalShots.value - bulkMakes.value;

  // Add new round
  rounds.value.push({ makes: bulkMakes.value, misses: bulkMisses });

  // Recalculate total shots
  totalShots.value = rounds.value.reduce(
    (sum, round) => sum + round.makes + round.misses,
    0,
  );

  // Reset input fields
  bulkMakes.value = 0;
  bulkTotalShots.value = 0;

  // Save to Local Storage
  saveToLocalStorage();
};

const editRound = (index) => {
  editingIndex.value = index;
};

const saveEdit = () => {
  if (editingIndex.value !== null) {
    totalShots.value = rounds.value.reduce(
      (sum, round) => sum + round.makes + round.misses,
      0,
    );

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
    totalShots.value = rounds.value.reduce(
      (sum, round) => sum + round.makes + round.misses,
      0,
    );
  }

  // Save to Local Storage
  saveToLocalStorage();
};
const savePracticeSession = () => {
  if (rounds.value.length === 0) {
    saveMessage.value = "No rounds to save.";
    setTimeout(() => (saveMessage.value = ""), 3000); // Clear after 3 sec
    return;
  }

  // Create a session record
  const session = {
    date: new Date().toLocaleString(),
    goal: goal.value,
    totalShots: totalShots.value,
    makes: totalMakes.value,
    misses: totalMisses.value,
    makePercentage: makePercentage.value,
    rounds: [...rounds.value], // Copy rounds data
  };

  // Store session in history
  practiceSessions.value.push(session);

  // Save sessions to Local Storage
  localStorage.setItem(
    "practiceSessions",
    JSON.stringify(practiceSessions.value),
  );

  // Reset current session
  rounds.value = [];
  totalShots.value = 0;
  makes.value = 0;
  misses.value = 0;
  goalEditable.value = true;

  // Save reset data
  saveToLocalStorage();

  // Show success message
  saveMessage.value = "Practice session saved!";
  setTimeout(() => (saveMessage.value = ""), 3000); // Clear after 3 sec
};
</script>
