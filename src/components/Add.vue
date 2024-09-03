<template>
  <div>
    <img class="logo" src="../assets/RestaurantLogo.png" alt="Restaurant Logo">
    <h1>Add A New Restaurant</h1>

    <div class="add">
      <input v-model="name" type="text" placeholder="Enter name">
      <input v-model="phone" type="tel" placeholder="Enter phone">
      <input v-model="location" type="text" placeholder="Enter location">
      
      <button @click="add">Add Restaurant</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddRestaurant',
  data() {
    return {
      name: '',
      phone: '',
      location: '',
      errorMessage: ''
    };
  },
  methods: {
    async checkRestaurantExists(name) {
      try {
        const response = await axios.get(`http://localhost:4600/api/v1/restaurant/check?name=${name}`);
        return response.data.exists;
      } catch (error) {
        console.error("Error checking if restaurant exists:", error);
        return false; // Default to false if there's an error checking
      }
    },

    async add() {
      // Basic validation
      if (!this.name) {
        this.errorMessage = "Name is required";
        return;
      }
      if (!this.phone) {
        this.errorMessage = "Phone number is required";
        return;
      }
      if (!this.location) {
        this.errorMessage = "Location is required";
        return;
      }

      // Check if the restaurant already exists
      const exists = await this.checkRestaurantExists(this.name);
      if (exists) {
        this.errorMessage = "Restaurant with similar details already exists";
        return;
      }

      // Reset error message
      this.errorMessage = '';

      const restaurant = {
        name: this.name,
        phone: this.phone,
        location: this.location,
      };

      console.log("Restaurant data being sent:", restaurant);  // Log the restaurant data

      axios.post('http://localhost:4600/api/v1/restaurant/create', restaurant)
        .then(response => {
          console.log("Response from backend:", response.data);
          this.$router.push('/home'); // Navigate to home.vue
        })
        .catch(error => {
          console.error("Error from backend:", error.response ? error.response.data : error.message);
          this.errorMessage = 'Error adding restaurant';
        });
    }
  }
};
</script>

<style>
.logo {
  width: 150px;
}

.add input {
  width: 300px;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #7B3F00;
}

.add button {
  width: 320px;
  height: 40px;
  background-color: #7B3F00;
  border: 1px solid #7B3F00;
  color: white;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
