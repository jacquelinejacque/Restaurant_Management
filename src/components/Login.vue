<template>
  <div>
    <img class="logo" src="../assets/RestaurantLogo.png" alt="Restaurant Logo" />
    <h1>Login</h1>
    <div class="login">
      <input v-model="email" type="email" placeholder="Enter email" />
      <input v-model="password" type="password" placeholder="Enter password" />
      <button @click="login">Login</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
      <p>
        <router-link to="/">SignUp</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Import axios for making HTTP requests

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    login() {
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

      // Reset error message
      this.errorMessage = "";

      const user = {
        email: this.email,
        password: this.password,
      };

      console.log("User data being sent:", user); // Log the user data

      // Make an API request to login
      axios
        .post("http://localhost:4600/api/v1/users/login", user)
        .then((response) => {
          console.log("Response from backend:", response.data);
          // Assuming the response contains user information along with the token
          const userInfo = {
            userID: response.data.data.userID,
            name: response.data.data.name,
            phone: response.data.data.phone,
            email: response.data.data.email,
            userType: response.data.data.userType,
            token: response.data.token,
          };
          localStorage.setItem("user-info", JSON.stringify(userInfo)); // Store user info
          this.$router.push("/home"); // Navigate to Home.vue on successful login
        })
        .catch((error) => {
          console.error(
            "Error from backend:",
            error.response ? error.response.data : error.message
          );
          this.errorMessage = error.response
            ? error.response.data.message
            : "An error occurred during login";
        });
    },
  },
};
</script>

<style>
.login input {
  width: 300px;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #7b3f00;
}

.login button {
  width: 320px;
  height: 40px;
  background-color: #7b3f00;
  border: 1px solid #7b3f00;
  color: white;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.logo {
  width: 150px;
}
</style>
