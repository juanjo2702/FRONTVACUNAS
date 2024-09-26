import jQuery from "jquery";
import "dropify/dist/js/dropify.min.js";
import "dropify/dist/css/dropify.min.css";

export default {
  mounted() {
    jQuery(".dropify").dropify();
  },
};
