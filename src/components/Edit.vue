<template>
  <Header/>
  <h1>Edit Restaurant Details</h1>
  <form @submit.prevent="updateRestaurant">
    <!-- Restaurant Details -->
    <div>
      <label for="name">Name:</label>
      <input v-model="restaurant.name" id="name" required />
    </div>
    <div>
      <label for="location">Location:</label>
      <input v-model="restaurant.location" id="location" required />
    </div>
    <div>
      <label for="phone">Phone:</label>
      <input v-model="restaurant.phone" id="phone" required />
    </div>

    <button type="submit">Update</button>
    <button @click="cancelEdit">Cancel</button>
  </form>
</template>

<script>
import axios from 'axios';
import Header from './AdminHeader.vue';

export default {
  name: 'EditRestaurant',
  components: {
    Header,
  },
  data() {
    return {
      restaurant: {
        name: '',
        location: '',
        phone: '',
        status: 'active',
      },
    };
  },
  async mounted() {
    const restaurantID = this.$route.params.id;
    try {
      // Fetch restaurant details
      const restaurantResponse = await axios.get(`http://localhost:4600/api/v1/restaurant/${restaurantID}`);
      this.restaurant = restaurantResponse.data.data; // Populate the restaurant object with data from the response
    } catch (error) {
      console.error('Failed to fetch restaurant data:', error);
      // Handle error (e.g., redirect to an error page)
    }
  },
  methods: {
    async updateRestaurant() {
      const restaurantID = this.$route.params.id;
      try {
        // Update restaurant details
        const restaurantResponse = await axios.put(`http://localhost:4600/api/v1/restaurant/update/${restaurantID}`, this.restaurant);
        console.log('Restaurant updated:', restaurantResponse.data);

        this.$router.push({ name: 'HomePage' });
      } catch (error) {
        console.error('Failed to update restaurant:', error);
        
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'HomePage' });
    },
  },
};
</script>
