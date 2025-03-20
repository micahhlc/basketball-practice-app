<template>
  <div class="p-4 pb-20">
    <h1 class="mb-4 text-2xl font-bold">Practice Session</h1>

    <!-- Set Practice Goal -->
    <div
      class="mb-4 flex items-center justify-between rounded-lg border border-blue-300 bg-blue-100 p-2 shadow-md"
    >
      <div class="flex items-center gap-2">
        <label for="goal" class="text-lg font-medium text-blue-800">
          Goal:
        </label>
        <input
          v-model.number="goal"
          id="goal"
          type="number"
          class="w-20 rounded-md border border-gray-400 p-1 text-center text-lg"
          disabled
        />
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

    <!-- Shared Input Area -->
    <div class="mt-4 rounded-lg border border-gray-300 bg-gray-100 p-4">
      <label class="block text-lg font-medium">
        {{ isBulkMode ? "Bulk Input Mode" : "Live Mode" }}
      </label>

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

      <div v-if="isBulkMode" class="mt-2 flex gap-4">
        <span class="px-2 py-2 font-bold text-green-600">Makes</span>
        <input
          v-model.number="bulkMakes"
          type="number"
          class="w-1/2 rounded border p-1 text-center"
        />
        <span class="px-2 py-2 font-bold">Total</span>
        <input
          v-model.number="bulkTotalShots"
          type="number"
          class="w-1/2 rounded border p-1 text-center"
        />
      </div>

      <button
        @click="isBulkMode ? logBulkRound() : logRound()"
        class="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md"
      >
        Log Round
      </button>
    </div>

    <!-- Save Message -->
    <div v-if="alertMessage" class="p-2 text-center font-bold text-green-600">
      {{ alertMessage }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Data
const router = useRouter();
const route = useRoute();
const sessionId = ref(route.query.sessionId || generateSessionId());
const goal = ref(200);
const totalShots = ref(0);
const makes = ref(0);
const misses = ref(0);
const rounds = ref([]);
const isBulkMode = ref(true);
const bulkMakes = ref(0);
const bulkTotalShots = ref(0);
const alertMessage = ref("");

onMounted(() => {
  const storedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
  const session = storedSessions.find((s) => s.sessionId === sessionId.value);
  if (session) {
    goal.value = session.goal;
    totalShots.value = session.totalShots;
    rounds.value = session.rounds;
  }
});

// Computed Properties
const totalMakes = computed(() =>
  rounds.value.reduce((sum, round) => sum + round.makes, 0),
);
const makePercentage = computed(() =>
  (totalShots.value === 0
    ? 0
    : ((totalMakes.value + makes.value) / totalShots.value) * 100
  ).toFixed(1),
);
const goalReached = computed(() => totalShots.value >= goal.value);

// Function to generate session ID
function generateSessionId() {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `session-${date}-${Date.now()}`;
}

// Log Functions
const logMake = () => {
  makes.value++;
  totalShots.value++;
};
const logMiss = () => {
  misses.value++;
  totalShots.value++;
};

const logRound = () => {
  if (makes.value === 0 && misses.value === 0) {
    alertMessage.value = "You haven't taken any shots!";
    setTimeout(() => (alertMessage.value = ""), 3000);
    return;
  }
  rounds.value.push({ makes: makes.value, misses: misses.value });
  totalShots.value = rounds.value.reduce(
    (sum, round) => sum + round.makes + round.misses,
    0,
  );
  makes.value = 0;
  misses.value = 0;
};

const logBulkRound = () => {
  if (bulkMakes.value > bulkTotalShots.value) {
    alertMessage.value = "Total Makes cannot be greater than Total Shots!";
    setTimeout(() => (alertMessage.value = ""), 3000);
    return;
  }
  const bulkMisses = bulkTotalShots.value - bulkMakes.value;
  rounds.value.push({ makes: bulkMakes.value, misses: bulkMisses });
  totalShots.value = rounds.value.reduce(
    (sum, round) => sum + round.makes + round.misses,
    0,
  );
  bulkMakes.value = 0;
  bulkTotalShots.value = 0;
};

// Save Practice Session
const savePracticeSession = () => {
  if (rounds.value.length === 0) {
    alertMessage.value = "No rounds to save.";
    setTimeout(() => (alertMessage.value = ""), 3000);
    return;
  }

  const storedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
  const existingSessionIndex = storedSessions.findIndex(
    (s) => s.sessionId === sessionId.value,
  );

  const sessionData = {
    sessionId: sessionId.value,
    date: new Date().toLocaleString(),
    goal: goal.value,
    totalShots: totalShots.value,
    makes: totalMakes.value,
    rounds: [...rounds.value],
  };

  if (existingSessionIndex !== -1) {
    storedSessions[existingSessionIndex] = sessionData;
  } else {
    storedSessions.push(sessionData);
  }

  localStorage.setItem("sessions", JSON.stringify(storedSessions));
  alertMessage.value = "Practice session saved!";
  setTimeout(() => (alertMessage.value = ""), 3000);
};
</script>
