<template>
    <img class="logo" src="../assets/RestaurantLogo.png" alt="">
    <h1>Register Here</h1>

    <div class="register">
        <input type="text" placeholder="enter name">
        <input type="email" placeholder="enter email">
        <input type="password" placeholder="enter password">
        <button>SignUp</button>
    </div>
</template>
<script>
export default{
    name:'SignUp'
}
</script>

<style>
    .logo{
        width: 150px;
    }
    .register input{
        width: 300px;
        height: 40px;
        padding-left: 20px;
        display: block;
        margin-bottom: 30px;
        margin-left: auto;
        margin-right: auto;
        border: 1px solid #7B3F00;
    }
    .register button{
        width: 320px;
        height: 40px;
        background-color: #7B3F00;
        border: 1px solid #7B3F00;
        color: white;
        cursor: pointer;
    }
</style>