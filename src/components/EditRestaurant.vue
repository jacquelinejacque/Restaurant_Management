<template>
  <Header/>
  <h1>Edit Restaurant Details</h1>
  <form @submit.prevent="updateRestaurant">
    <div class="add">
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
    </div>

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
    const response = await axios.get(`http://localhost:4600/api/v1/restaurant/list/${restaurantID}`);
    this.restaurant = response.data.restaurant; // Assuming the response structure
  } catch (error) {
    console.error('Failed to fetch restaurant data:', error);
    alert('Could not fetch restaurant details. Please try again later.');
  }
},
  methods: {
    async updateRestaurant() {
      const restaurantID = this.$route.params.id;
      try {
        const response = await axios.put(`http://localhost:4600/api/v1/restaurant/update/${restaurantID}`, this.restaurant);
        console.log('Restaurant updated:', response.data);
        this.$router.push({ name: 'HomePage' });
      } catch (error) {
        console.error('Failed to update restaurant:', error);
        alert('Could not update restaurant details. Please try again later.');
      }
    },
    cancelEdit() {
      this.$router.push({ name: 'HomePage' });
    },
  },
};
</script>



<style>


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
  width: 150px;
  height: 40px;
  background-color: #7B3F00;
  border: 1px solid #7B3F00;
  color: white;
  cursor: pointer;
  margin: 10px;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>