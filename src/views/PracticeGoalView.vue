<template>
  <div class="flex h-screen flex-col items-center justify-center p-6">
    <h1 class="mb-6 text-2xl font-bold">Set Your Practice Goal</h1>
    <div class="flex">
      <div class="flex flex-col items-start">
        <label for="goal" class="text-lg font-medium text-blue-800">
          Total shots target:
        </label>
        <input
          v-model.number="goal"
          id="goal"
          type="number"
          class="mt-2 w-24 rounded-md border border-gray-400 p-2 text-center text-lg"
        />
      </div>
      <button
        @click="startPractice(false)"
        :disabled="goal <= 0"
        class="mt-4 rounded-lg bg-blue-500 px-6 py-2 text-white shadow-md disabled:opacity-50"
      >
        Start New Practice
      </button>
    </div>

    <button
      v-if="existingSessionId"
      @click="startPractice(true)"
      class="mt-2 rounded-lg bg-green-500 px-6 py-2 text-white shadow-md"
    >
      Continue Previous Session
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goal = ref(200);
const existingSessionId = ref(null); // Store previous session ID (if exists)
const todayDate = getYYYYMMDD(); // Generate today's date string

// Function to get YYYYMMDD format date
function getYYYYMMDD() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
}

onMounted(() => {
  // Retrieve session ID and check if it's from today
  const storedSessionId = localStorage.getItem("currentSessionId");
  const sessions = JSON.parse(localStorage.getItem("sessions")) || {};
  const existingSession = sessions[storedSessionId] || null;
  if (existingSession && storedSessionId.indexOf(todayDate) > -1) {
    existingSessionId.value = storedSessionId;
    console.log("Existing session ID found:", existingSessionId.value);
    goal.value = existingSession.goal; // Load existing session goal
    console.log("Existing session goal:", goal.value);
  } else {
    console.log("No existing session found");
    goal.value = parseInt(localStorage.getItem("practiceGoal")) || 200; // Load last goal
  }
});

// Function to start a new or continue an existing practice session
const startPractice = (reloadPrevious) => {
  let sessionId;

  if (reloadPrevious && existingSessionId.value) {
    // ✅ Continue today's existing session
    sessionId = existingSessionId.value;
  } else {
    // ✅ Create a new session ID with today's date
    sessionId = `session-${todayDate}-${Date.now()}`;
    localStorage.setItem("currentSessionId", sessionId);
    localStorage.setItem("practiceGoal", goal.value); // Save goal
  }
  router.push({ path: "/practice-d", query: { sessionId } });
};
</script>
