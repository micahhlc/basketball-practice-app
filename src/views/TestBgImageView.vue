<template>
  <!-- Background container -->
  <div class="background-container">
    <!-- Each button is inside its own wrapper div -->
    <div class="button-wrapper button-one">
      <button @click="handleClick1">Button 1</button>
    </div>
    <div class="button-wrapper button-two">
      <button @click="handleClick2">Button 2</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionedButtons",
  methods: {
    handleClick1() {
      console.log("Button 1 clicked");
    },
    handleClick2() {
      console.log("Button 2 clicked");
    },
  },
};
</script>

<style scoped>
.background-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("../assets/HalfCourtBasketball.webp");
  background-size: cover;
  background-position: center;
}

/* Shared wrapper for buttons */
.button-wrapper {
  position: absolute;
}

/* Positioning for Button 1 */
.button-one {
  top: 20%;
  left: 35%;
}

/* Positioning for Button 2 */
.button-two {
  top: 50%;
  left: 70%;
}

/* Button styling */
button {
  padding: 1em 1.5em;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
}
</style>
