<template>
  <div>
    <img class="logo" src="../assets/RestaurantLogo.png" alt="Restaurant Logo">
    <h1>Register Here</h1>

    <div class="register">
      <input v-model="name" type="text" placeholder="Enter name">
      <input v-model="phone" type="text" placeholder="Enter phone">
      <input v-model="email" type="email" placeholder="Enter email">
      <input v-model="password" type="password" placeholder="Enter password">
      
      <!-- User Type Selection -->
      <select v-model="userType">
        <option disabled value="">Select user type</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>
      
      <!-- Conditionally display creditCardNumber input -->
      <input v-if="userType === 'customer'" v-model="creditCardNumber" type="text" placeholder="Enter credit card number">
      
      <button @click="signUp">Sign Up</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      phone: '',
      email: '',
      password: '',
      userType: '',          // New userType data field
      creditCardNumber: '',   // New creditCardNumber data field (only for customers)
      errorMessage: ''
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    signUp() {
      // Basic validation
      if (!this.name) {
        this.errorMessage = "Name is required";
        return;
      }
      if (!this.phone) {
        this.errorMessage = "Phone number is required";
        return;
      }
      if (!this.email) {
        this.errorMessage = "Email is required";
        return;
      }
      if (!this.validateEmail(this.email)) {
        this.errorMessage = "Invalid email format";
        return;
      }
      if (!this.password) {
        this.errorMessage = "Password is required";
        return;
      }
      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters long";
        return;
      }
      if (!this.userType) {
        this.errorMessage = "User type is required";
        return;
      }
      if (this.userType === 'customer' && !this.creditCardNumber) {
        this.errorMessage = "Credit card number is required for customers";
        return;
      }

      // Reset error message
      this.errorMessage = '';

      const user = {
        name: this.name,
        phone: this.phone,
        email: this.email,
        password: this.password,
        userType: this.userType,
      };

      // Include creditCardNumber if userType is customer
      if (this.userType === 'customer') {
        user.creditCardNumber = this.creditCardNumber;
      }

      console.log("User data being sent:", user);  // Log the user data

      axios.post('http://localhost:4600/api/v1/users/create', user)
        .then(response => {
          console.log("Response from backend:", response.data);
          localStorage.setItem('userToken', response.data.token); // Assuming token is returned
          this.$router.push('/login'); // Navigate to login.vue
        })
        .catch(error => {
          console.error("Error from backend:", error.response ? error.response.data : error.message);
          alert('Error registering user');
        });
    }
  }
};
</script>

<style>
.logo {
  width: 150px;
}

.register input,
.register select {
  width: 300px;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #7B3F00;
}

.register button {
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
