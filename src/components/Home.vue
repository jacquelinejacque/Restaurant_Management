<template>
  <Header />
  <h1 v-if="name">Hello {{ name }}, Welcome to Home Page</h1>
  <h1 v-else>Welcome to Home Page</h1>
  <table border="1">
    <tr>
      <td>Id</td>
      <td>Name</td>
      <td>Location</td>
      <td>Phone</td>
      <td>Status</td>
      <td>Actions</td>
    </tr>
    <tr v-for="item in restaurant" :key="item.restaurantID">
      <td>{{ item.restaurantID }}</td>
      <td>{{ item.name }}</td>
      <td>{{ item.location }}</td>
      <td>{{ item.phone }}</td>
      <td>{{ item.status }}</td>
      <td>
        <!-- Edit Button -->
        <router-link :to="{ name: 'EditRestaurant', params: { id: item.restaurantID } }">
          <button>Edit</button>
        </router-link>

        <!-- Delete Button -->
        <button @click="deleteRestaurant(item.restaurantID)">Delete</button>
      </td>
    </tr>
  </table>
</template>


<script>
import Header from './AdminHeader.vue';
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      name: '',
      restaurant: [],
    };
  },
  components: {
    Header
  },
  async mounted() {
    let user = localStorage.getItem('user-info');
    
    if (!user) {
      this.$router.push({ name: 'SignUp' });
    } else {
      try {
        const userInfo = JSON.parse(user);
        if (userInfo && userInfo.name) {
          this.name = userInfo.name;
        }
      } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
      }
    }
    
    let result = await axios.get("http://localhost:4600/api/v1/restaurant/list");
    this.restaurant = result.data.data; // Adjust based on actual response structure
  },
  methods: {
    async deleteRestaurant(restaurantID) {
      try {
        const response = await axios.delete(`http://localhost:4600/api/v1/restaurant/delete/${restaurantID}`);
        console.log("Delete response:", response);

        // Update the local state to reflect the status change
        this.restaurant = this.restaurant.map(item => 
          item.restaurantID === restaurantID
            ? { ...item, status: 'inactive' }
            : item
        );
      } catch (error) {
        console.error("Failed to delete restaurant:", error);
      }
    }
  }
};
</script>
