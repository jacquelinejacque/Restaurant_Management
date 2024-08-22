<template>
  <div>
    <h1>Restaurant Details</h1>
    <div v-if="restaurant">
      <p><strong>Name:</strong> {{ restaurant.name }}</p>
      <p><strong>Location:</strong> {{ restaurant.location }}</p>
      <p><strong>Phone:</strong> {{ restaurant.phone }}</p>
      <p><strong>Status:</strong> {{ restaurant.status }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <button @click="goBack">Go Back</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RestaurantDetails',
  data() {
    return {
      restaurant: null,
    };
  },
  async mounted() {
    const restaurantId = this.$route.params.id;
    try {
      const response = await axios.get(`http://localhost:4600/api/v1/restaurant/${restaurantId}`);
      this.restaurant = response.data.restaurant; // Adjust according to your API response structure
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      // Handle error, e.g., show an error message to the user
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1); // Navigate back to the previous page
    },
  },
};
</script>

<style scoped>
/* Add styles if needed */
div {
  margin: 20px;
}
h1 {
  margin-bottom: 10px;
}
p {
  margin: 5px 0;
}
button {
  margin-top: 20px;
}
</style>
