<template>
  <div>
    <label :for="label">{{ label }}</label>
    <input type="file" :id="label" accept="image/*;capture=camera" class="dropify" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';
import $ from 'jquery';

const props = defineProps({
  label: String,
  modelValue: String
});

onMounted(() => {
  $(`#${props.label}`).dropify();
});
</script>
